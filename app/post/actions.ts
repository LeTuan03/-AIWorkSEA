"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createJob, countRecentJobsByUser } from "@/lib/jobs";
import { requireUser } from "@/lib/session";
import { validateJobForm, type JobFormState } from "@/lib/job-validation";

const MAX_POSTS_PER_HOUR = 10;

export async function createJobAction(
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const user = await requireUser();

  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { error: "Gửi biểu mẫu thất bại." };
  }

  const result = validateJobForm(formData);
  if (!result.ok) return { error: result.error, values: result.values };

  // Per-user posting rate limit.
  const recent = await countRecentJobsByUser(user.id, 60 * 60 * 1000);
  if (recent >= MAX_POSTS_PER_HOUR) {
    return {
      error: "Bạn đã đăng quá nhiều tin trong 1 giờ. Vui lòng thử lại sau.",
      values: result.values,
    };
  }

  // New posts are PENDING (moderation) and never self-featured.
  try {
    await createJob({
      ...result.data,
      featured: false,
      status: "PENDING",
      userId: user.id,
    });
  } catch {
    return { error: "Có lỗi khi lưu tin. Vui lòng thử lại.", values: result.values };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?toast=posted");
}
