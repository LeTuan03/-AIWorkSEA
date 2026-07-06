"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getJob, setJobStatus, updateJob } from "@/lib/jobs";
import { requireUser } from "@/lib/session";
import { validateJobForm, type JobFormState } from "@/lib/job-validation";

// Close one of the current user's own listings.
export async function closeJobAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("jobId") ?? "");

  const job = await getJob(id);
  if (!job || job.userId !== user.id) redirect("/dashboard");

  await setJobStatus(id, "CLOSED");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/jobs/${id}`);
  redirect("/dashboard?toast=closed");
}

// Edit one of the current user's own listings. Editing sends it back to PENDING.
export async function updateJobAction(
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const user = await requireUser();
  const id = String(formData.get("jobId") ?? "");

  const job = await getJob(id);
  if (!job || job.userId !== user.id) {
    return { error: "Không tìm thấy tin hoặc bạn không có quyền sửa." };
  }

  const result = validateJobForm(formData);
  if (!result.ok) return { error: result.error, values: result.values };

  try {
    await updateJob(id, { ...result.data, status: "PENDING" });
  } catch {
    return { error: "Có lỗi khi cập nhật. Vui lòng thử lại.", values: result.values };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/jobs/${id}`);
  redirect("/dashboard?toast=updated");
}
