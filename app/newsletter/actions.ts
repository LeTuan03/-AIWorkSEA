"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import {
  EMAIL_RE,
  upsertPendingSubscriber,
  confirmUrl,
} from "@/lib/newsletter";

export type NewsletterState = { ok?: boolean; error?: string; message?: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function subscribeAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { ok: true, message: "Cảm ơn bạn đã đăng ký." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "home").slice(0, 20);

  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return { error: "Email không hợp lệ." };
  }

  const ip = await clientIp();
  if (!rateLimit(`subscribe:${ip}`, 5, 60 * 60_000)) {
    return { error: "Bạn thử quá nhiều lần. Vui lòng đợi ít phút." };
  }

  let result;
  try {
    result = await upsertPendingSubscriber(email, source);
  } catch {
    return { error: "Có lỗi khi đăng ký. Vui lòng thử lại." };
  }

  if (result.status === "already_confirmed") {
    return { ok: true, message: "Email này đã đăng ký rồi. Cảm ơn bạn!" };
  }

  const url = confirmUrl(result.confirmToken);
  const send = await sendEmail({
    to: email,
    subject: "Xác nhận đăng ký AI Jobs Digest",
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#2b2320">
        <h2 style="color:#a8331a">Xác nhận đăng ký</h2>
        <p>Bấm nút dưới đây để xác nhận nhận <strong>AI Jobs Digest</strong> — tổng hợp việc AI &amp; Automation mới hằng tuần ở Đông Nam Á.</p>
        <p style="margin:24px 0">
          <a href="${url}" style="background:#b23a1e;color:#f7f1de;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Xác nhận đăng ký</a>
        </p>
        <p style="color:#6b5d52;font-size:13px">Nếu không phải bạn đăng ký, hãy bỏ qua email này.</p>
      </div>`,
  });

  if (send.skipped) {
    // Dev without RESEND_API_KEY: surface the link so the flow is testable.
    console.warn(`[newsletter] confirm link for ${email}: ${url}`);
  }

  return {
    ok: true,
    message: "Gần xong! Kiểm tra email và bấm liên kết xác nhận.",
  };
}
