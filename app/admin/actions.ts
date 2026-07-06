"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getJob, setJobStatus, setJobFeatured } from "@/lib/jobs";
import { requireAdmin } from "@/lib/session";

function revalidateJob(id: string) {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/jobs/${id}`);
}

export async function approveJobAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("jobId") ?? "");
  if (!id) return;
  await setJobStatus(id, "PUBLISHED");
  revalidateJob(id);
  redirect("/admin?toast=approved");
}

export async function rejectJobAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("jobId") ?? "");
  if (!id) return;
  await setJobStatus(id, "CLOSED");
  revalidateJob(id);
  redirect("/admin?toast=rejected");
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
