import { timingSafeEqual } from "node:crypto";
import type { Job } from "@prisma/client";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { formatBudget } from "@/lib/jobs";
import { LOCATION_LABELS } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import {
  getConfirmedSubscribers,
  getRecentJobsForDigest,
  unsubscribeUrl,
} from "@/lib/newsletter";

// Weekly digest sender. Triggered by a scheduled GitHub Action:
//   POST /api/digest  with header  x-cron-secret: <CRON_SECRET>
// Refuses to run if CRON_SECRET is unset (so the endpoint is never open).

const esc = (s: string) =>
  s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] ?? c);

function jobRow(job: Job): string {
  const loc = LOCATION_LABELS[job.location] ?? job.location;
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e6dcc6">
        <a href="${SITE_URL}/jobs/${job.id}" style="color:#a8331a;font-weight:600;text-decoration:none;font-size:15px">${esc(job.title)}</a>
        <div style="color:#6b5d52;font-size:13px;margin-top:2px">${esc(job.company)} · ${esc(loc)} · ${esc(formatBudget(job))}</div>
      </td>
    </tr>`;
}

function buildHtml(jobsHtml: string, count: number, unsubLink: string): string {
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:auto;color:#2b2320">
    <h2 style="color:#a8331a;margin-bottom:4px">AI Jobs Digest</h2>
    <p style="color:#6b5d52;margin-top:0">${count} việc AI &amp; Automation mới trong tuần ở Đông Nam Á</p>
    <table style="width:100%;border-collapse:collapse">${jobsHtml}</table>
    <p style="margin-top:24px">
      <a href="${SITE_URL}" style="background:#b23a1e;color:#f7f1de;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:600">Xem tất cả việc làm</a>
    </p>
    <hr style="border:none;border-top:1px solid #e6dcc6;margin:24px 0" />
    <p style="color:#8a7c6f;font-size:12px">
      Bạn nhận email này vì đã đăng ký AI Jobs Digest.
      <a href="${unsubLink}" style="color:#8a7c6f">Hủy đăng ký</a>.
    </p>
  </div>`;
}

// Constant-time comparison so the secret can't be probed via response timing.
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (!safeEqual(request.headers.get("x-cron-secret") ?? "", secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // The cron fires weekly; even with a leaked secret this bounds email blasts.
  if (!rateLimit("digest-send", 2, 60 * 60_000)) {
    return Response.json({ error: "Too many digest runs" }, { status: 429 });
  }

  const jobs = await getRecentJobsForDigest(7);
  if (jobs.length === 0) {
    return Response.json({ sent: 0, reason: "no new jobs this week" });
  }

  const subscribers = await getConfirmedSubscribers();
  if (subscribers.length === 0) {
    return Response.json({ sent: 0, reason: "no confirmed subscribers" });
  }

  const jobsHtml = jobs.map(jobRow).join("");
  const subject = `AI Jobs Digest · ${jobs.length} việc mới tuần này`;

  let sent = 0;
  for (const sub of subscribers) {
    const html = buildHtml(jobsHtml, jobs.length, unsubscribeUrl(sub.unsubToken));
    const res = await sendEmail({ to: sub.email, subject, html });
    if (res.ok) sent += 1;
  }

  await prisma.digestLog.create({
    data: { jobCount: jobs.length, recipients: sent, subject },
  });

  return Response.json({ sent, subscribers: subscribers.length, jobs: jobs.length });
}
