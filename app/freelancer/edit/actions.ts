"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import {
  getProfileByUserId,
  isUsernameTaken,
  upsertProfile,
} from "@/lib/profiles";
import { recordEvent } from "@/lib/analytics";
import {
  validateProfileForm,
  type ProfileFormState,
} from "@/lib/profile-validation";

export async function saveProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser();

  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { error: "Gửi biểu mẫu thất bại." };
  }

  const result = validateProfileForm(formData);
  if (!result.ok) return { error: result.error, values: result.values };

  // Light per-user edit throttle.
  if (!rateLimit(`profile:${user.id}`, 20, 60 * 60_000)) {
    return {
      error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.",
      values: result.values,
    };
  }

  if (await isUsernameTaken(result.data.username, user.id)) {
    return {
      error: "Username này đã có người dùng. Vui lòng chọn tên khác.",
      values: result.values,
    };
  }

  // Distinguish create from update before the upsert (GĐ0: profile_created).
  const existing = await getProfileByUserId(user.id);

  try {
    await upsertProfile(user.id, result.data);
  } catch {
    return {
      error: "Có lỗi khi lưu hồ sơ. Vui lòng thử lại.",
      values: result.values,
    };
  }

  if (!existing) {
    await recordEvent("profile_created", { refId: result.data.username });
  }

  revalidatePath(`/freelancer/${result.data.username}`);
  revalidatePath("/freelancers");
  redirect(`/freelancer/${result.data.username}?toast=profile-saved`);
}
