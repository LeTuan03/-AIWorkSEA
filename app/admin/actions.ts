"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Job } from "@prisma/client";
import {
  getJob,
  getJobOwnerEmail,
  setJobStatus,
  setJobFeatured,
} from "@/lib/jobs";
import { setProfileVerified } from "@/lib/profiles";
import { requireAdmin } from "@/lib/session";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/seo";

function revalidateJob(id: string) {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/jobs/${id}`);
}

const esc = (s: string) =>
  s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] ?? c);

// Notify the recruiter about a moderation decision (GĐ3). sendEmail never
// throws and skips gracefully without RESEND_API_KEY, so moderation always
// completes even if mail is down.
async function notifyOwner(job: Job, approved: boolean): Promise<void> {
  const to = await getJobOwnerEmail(job);
  if (!to) return;

  const jobUrl = `${SITE_URL}/jobs/${job.id}`;
  const html = approved
    ? `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#2b2320">
        <h2 style="color:#a8331a">Tin của bạn đã được duyệt</h2>
        <p><strong>${esc(job.title)}</strong> hiện đã hiển thị công khai trên AIWork SEA và xuất hiện trong kết quả tìm kiếm, newsletter hằng tuần.</p>
        <p style="margin:24px 0">
          <a href="${jobUrl}" style="background:#b23a1e;color:#f7f1de;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Xem tin của bạn</a>
        </p>
        <p style="color:#6b5d52;font-size:13px">Mẹo: chia sẻ liên kết tin lên LinkedIn/Facebook giúp tiếp cận thêm nhiều freelancer phù hợp.</p>
      </div>`
    : `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#2b2320">
        <h2 style="color:#a8331a">Tin của bạn chưa được duyệt</h2>
        <p><strong>${esc(job.title)}</strong> chưa đạt tiêu chí hiển thị (thường do mô tả quá sơ sài, thiếu cách ứng tuyển, hoặc nội dung không thuộc lĩnh vực AI/Automation).</p>
        <p>Bạn có thể sửa lại tin trong bảng điều khiển — tin sửa xong sẽ được duyệt lại.</p>
        <p style="margin:24px 0">
          <a href="${SITE_URL}/dashboard" style="background:#b23a1e;color:#f7f1de;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Mở bảng điều khiển</a>
        </p>
      </div>`;

  await sendEmail({
    to,
    subject: approved
      ? `Tin "${job.title}" đã được duyệt và đang hiển thị`
      : `Tin "${job.title}" chưa được duyệt`,
    html,
  });
}

export async function approveJobAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("jobId") ?? "");
  if (!id) return;
  const job = await setJobStatus(id, "PUBLISHED");
  await notifyOwner(job, true);
  revalidateJob(id);
  redirect("/admin?toast=approved");
}

export async function rejectJobAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("jobId") ?? "");
  if (!id) return;
  const job = await setJobStatus(id, "CLOSED");
  await notifyOwner(job, false);
  revalidateJob(id);
  redirect("/admin?toast=rejected");
}

// Admin-only trust control: toggle the "Đã xác thực" badge on a profile (GĐ1).
export async function toggleVerifiedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("profileId") ?? "");
  const username = String(formData.get("username") ?? "");
  const next = String(formData.get("next") ?? "") === "true";
  if (!id) return;
  await setProfileVerified(id, next);
  revalidatePath("/admin/freelancers");
  revalidatePath("/freelancers");
  if (username) revalidatePath(`/freelancer/${username}`);
  redirect("/admin/freelancers?toast=verified");
}

// Admin-only monetization control: toggle the Featured (pinned) flag.
export async function toggleFeaturedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("jobId") ?? "");
  if (!id) return;
  const job = await getJob(id);
  if (!job) return;
  await setJobFeatured(id, !job.featured);
  revalidateJob(id);
  redirect("/admin?toast=featured");
}
