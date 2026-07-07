import {
  isValidAvailability,
  isValidVisibility,
  PROFILE_LIMITS,
  USERNAME_RE,
} from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Raw trimmed values echoed back to the form to preserve user input on error.
export type ProfileFormValues = {
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  skills: string;
  portfolioUrl: string;
  avatarUrl: string;
  rateReference: string;
  contactEmail: string;
  contactPhone: string;
  availability: string;
  visibility: string;
};

// Clean payload ready for upsertProfile.
export type ValidatedProfile = {
  username: string;
  displayName: string;
  headline: string | null;
  bio: string;
  skills: string;
  portfolioUrl: string | null;
  avatarUrl: string | null;
  rateReference: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  availability: string;
  visibility: string;
};

export type ProfileFormState = {
  error?: string;
  values?: ProfileFormValues;
};

export type ProfileValidationResult =
  | { ok: true; data: ValidatedProfile; values: ProfileFormValues }
  | { ok: false; error: string; values: ProfileFormValues };

export function readProfileForm(formData: FormData): ProfileFormValues {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  return {
    username: get("username").toLowerCase(),
    displayName: get("displayName"),
    headline: get("headline"),
    bio: get("bio"),
    skills: get("skills"),
    portfolioUrl: get("portfolioUrl"),
    avatarUrl: get("avatarUrl"),
    rateReference: get("rateReference"),
    contactEmail: get("contactEmail").toLowerCase(),
    contactPhone: get("contactPhone"),
    availability: get("availability") || "OPEN",
    visibility: get("visibility") || "PUBLIC",
  };
}

export function validateProfileForm(formData: FormData): ProfileValidationResult {
  const values = readProfileForm(formData);
  const fail = (error: string): ProfileValidationResult => ({
    ok: false,
    error,
    values,
  });

  if (!values.username || !values.displayName || !values.bio || !values.skills) {
    return fail("Vui lòng điền đủ Username, Tên hiển thị, Giới thiệu và Kỹ năng.");
  }

  if (!USERNAME_RE.test(values.username)) {
    return fail(
      "Username chỉ gồm chữ thường, số, gạch nối (3–30 ký tự). VD: nguyen-ai",
    );
  }

  // Length limits
  if (values.displayName.length > PROFILE_LIMITS.displayName)
    return fail(`Tên hiển thị tối đa ${PROFILE_LIMITS.displayName} ký tự.`);
  if (values.headline.length > PROFILE_LIMITS.headline)
    return fail(`Tiêu đề tối đa ${PROFILE_LIMITS.headline} ký tự.`);
  if (values.bio.length > PROFILE_LIMITS.bio)
    return fail(`Giới thiệu tối đa ${PROFILE_LIMITS.bio} ký tự.`);
  if (values.skills.length > PROFILE_LIMITS.skills)
    return fail(`Kỹ năng tối đa ${PROFILE_LIMITS.skills} ký tự.`);
  if (values.rateReference.length > PROFILE_LIMITS.rateReference)
    return fail(`Mức giá tham khảo quá dài.`);
  if (
    values.portfolioUrl.length > PROFILE_LIMITS.portfolioUrl ||
    values.avatarUrl.length > PROFILE_LIMITS.avatarUrl
  ) {
    return fail("Đường dẫn quá dài.");
  }
  if (values.contactPhone.length > PROFILE_LIMITS.contactPhone)
    return fail("Số điện thoại quá dài.");

  // Enums
  if (!isValidAvailability(values.availability))
    return fail("Trạng thái nhận việc không hợp lệ.");
  if (!isValidVisibility(values.visibility))
    return fail("Chế độ hiển thị không hợp lệ.");

  // URLs must be http(s)
  if (values.portfolioUrl && !/^https?:\/\//i.test(values.portfolioUrl))
    return fail("Link portfolio phải bắt đầu bằng http:// hoặc https://");
  if (values.avatarUrl && !/^https?:\/\//i.test(values.avatarUrl))
    return fail("Link ảnh đại diện phải bắt đầu bằng http:// hoặc https://");

  if (values.contactEmail) {
    if (values.contactEmail.length > PROFILE_LIMITS.contactEmail)
      return fail("Email quá dài.");
    if (!EMAIL_RE.test(values.contactEmail))
      return fail("Email liên hệ không hợp lệ.");
  }

  return {
    ok: true,
    values,
    data: {
      username: values.username,
      displayName: values.displayName,
      headline: values.headline || null,
      bio: values.bio,
      skills: values.skills,
      portfolioUrl: values.portfolioUrl || null,
      avatarUrl: values.avatarUrl || null,
      rateReference: values.rateReference || null,
      contactEmail: values.contactEmail || null,
      contactPhone: values.contactPhone || null,
      availability: values.availability,
      visibility: values.visibility,
    },
  };
}
