"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, requireUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { isValidColumn, CARD_LIMITS } from "@/lib/constants";
import {
  createCard,
  deleteCard,
  moveCard,
  hasCardForJob,
  type TrackerCard,
} from "@/lib/tracker";
import { getJob } from "@/lib/jobs";
import { recordEvent } from "@/lib/analytics";

export type CreateCardResult =
  | { ok: true; card: TrackerCard }
  | { ok: false; error: string };

// Called directly (RPC) from the board's add form.
export async function createCardAction(input: {
  title: string;
  company?: string;
  link?: string;
  notes?: string;
}): Promise<CreateCardResult> {
  const user = await requireUser();

  const title = (input.title ?? "").trim();
  const company = (input.company ?? "").trim();
  const link = (input.link ?? "").trim();
  const notes = (input.notes ?? "").trim();

  if (!title) return { ok: false, error: "Nhập tên công việc." };
  if (title.length > CARD_LIMITS.title) return { ok: false, error: "Tên quá dài." };
  if (company.length > CARD_LIMITS.company)
    return { ok: false, error: "Tên công ty quá dài." };
  if (link.length > CARD_LIMITS.link) return { ok: false, error: "Link quá dài." };
  if (notes.length > CARD_LIMITS.notes)
    return { ok: false, error: "Ghi chú quá dài." };
  if (link && !/^https?:\/\//i.test(link) && !link.startsWith("/"))
    return { ok: false, error: "Link phải bắt đầu bằng http:// hoặc https://" };

  if (!rateLimit(`card:${user.id}`, 60, 60 * 60_000)) {
    return { ok: false, error: "Bạn thêm thẻ quá nhanh, thử lại sau." };
  }

  const card = await createCard(user.id, {
    title,
    company: company || null,
    link: link || null,
    notes: notes || null,
  });
  revalidatePath("/tracker");
  return { ok: true, card };
}

export async function deleteCardAction(cardId: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  await deleteCard(user.id, cardId);
  revalidatePath("/tracker");
  return { ok: true };
}

export async function moveCardAction(
  toColumn: string,
  orderedIds: string[],
): Promise<{ ok: boolean }> {
  const user = await requireUser();
  if (!isValidColumn(toColumn)) return { ok: false };
  if (!Array.isArray(orderedIds) || orderedIds.length > 500)
    return { ok: false };
  const ok = await moveCard(user.id, toColumn, orderedIds);
  if (ok) revalidatePath("/tracker");
  return { ok };
}

// Fired when a visitor clicks "Ứng tuyển": records the apply event (works for
// guests too) and auto-creates a tracker card for signed-in users (GĐ1).
export async function applyClickAction(
  jobId: string,
): Promise<{ tracked: boolean }> {
  const job = await getJob(jobId);
  if (!job || job.status !== "PUBLISHED") return { tracked: false };

  await recordEvent("job_apply_click", {
    path: `/jobs/${job.id}`,
    refId: job.id,
  });

  const user = await getCurrentUser();
  if (!user) return { tracked: false };
  if (await hasCardForJob(user.id, job.id)) return { tracked: false };

  await createCard(user.id, {
    title: job.title,
    company: job.company,
    link: `/jobs/${job.id}`,
    jobId: job.id,
  });
  revalidatePath("/tracker");
  return { tracked: true };
}

// "Track this application" button on a job page → creates a card, no duplicates.
export async function trackJobAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const jobId = String(formData.get("jobId") ?? "");
  const job = await getJob(jobId);
  if (!job) redirect("/tracker");

  if (await hasCardForJob(user.id, jobId)) {
    redirect("/tracker?toast=already-tracked");
  }

  await createCard(user.id, {
    title: job.title,
    company: job.company,
    link: `/jobs/${job.id}`,
    jobId: job.id,
  });
  revalidatePath("/tracker");
  redirect("/tracker?toast=tracked");
}
