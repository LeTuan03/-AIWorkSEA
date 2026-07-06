import {
  isValidCategory,
  isValidLocation,
  isValidWorkType,
  isValidEngagement,
  isValidCurrency,
  LIMITS,
} from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Raw, trimmed string values echoed back to the form to preserve user input.
export type JobFormValues = {
  title: string;
  company: string;
  companyUrl: string;
  category: string;
  location: string;
  workType: string;
  engagement: string;
  budgetMin: string;
  budgetMax: string;
  currency: string;
  description: string;
  skills: string;
  applyUrl: string;
  applyEmail: string;
};

// Clean, typed payload ready for createJob / updateJob.
export type ValidatedJob = {
  title: string;
  company: string;
  companyUrl: string | null;
  category: string;
  location: string;
  workType: string;
  engagement: string;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  description: string;
  skills: string;
  applyUrl: string | null;
  applyEmail: string | null;
};

export type ValidationResult =
  | { ok: true; data: ValidatedJob; values: JobFormValues }
  | { ok: false; error: string; values: JobFormValues };

// Shared useActionState shape for the create + edit job forms.
export type JobFormState = {
  error?: string;
  values?: JobFormValues;
};

export function readJobForm(formData: FormData): JobFormValues {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  return {
    title: get("title"),
    company: get("company"),
    companyUrl: get("companyUrl"),
    category: get("category"),
    location: get("location"),
    workType: get("workType"),
    engagement: get("engagement"),
    budgetMin: get("budgetMin"),
    budgetMax: get("budgetMax"),
    currency: get("currency") || "USD",
    description: get("description"),
    skills: get("skills"),
    applyUrl: get("applyUrl"),
    applyEmail: get("applyEmail"),
  };
}

// Shared server-side validation for both the create and edit flows.
export function validateJobForm(formData: FormData): ValidationResult {
  const values = readJobForm(formData);
  const fail = (error: string): ValidationResult => ({ ok: false, error, values });

  if (!values.title || !values.company || !values.description || !values.skills) {
    return fail("Vui lòng điền đủ Tiêu đề, Công ty, Mô tả và Kỹ năng.");
  }

  // Length limits (anti-abuse / storage bloat)
  if (values.title.length > LIMITS.title)
    return fail(`Tiêu đề tối đa ${LIMITS.title} ký tự.`);
  if (values.company.length > LIMITS.company)
    return fail(`Tên công ty tối đa ${LIMITS.company} ký tự.`);
  if (values.description.length > LIMITS.description)
    return fail(`Mô tả tối đa ${LIMITS.description} ký tự.`);
  if (values.skills.length > LIMITS.skills)
    return fail(`Kỹ năng tối đa ${LIMITS.skills} ký tự.`);
  if (
    values.companyUrl.length > LIMITS.companyUrl ||
    values.applyUrl.length > LIMITS.applyUrl
  ) {
    return fail("Đường dẫn quá dài.");
  }
  if (values.applyEmail.length > LIMITS.applyEmail) return fail("Email quá dài.");

  // Taxonomy allowlists
  if (!isValidCategory(values.category)) return fail("Lĩnh vực không hợp lệ.");
  if (!isValidLocation(values.location)) return fail("Địa điểm không hợp lệ.");
  if (!isValidWorkType(values.workType))
    return fail("Hình thức làm việc không hợp lệ.");
  if (!isValidEngagement(values.engagement))
    return fail("Loại hợp đồng không hợp lệ.");
  if (!isValidCurrency(values.currency)) return fail("Tiền tệ không hợp lệ.");

  // Apply method
  if (!values.applyUrl && !values.applyEmail) {
    return fail("Cần ít nhất một cách ứng tuyển: link hoặc email.");
  }
  if (values.applyEmail && !EMAIL_RE.test(values.applyEmail)) {
    return fail("Email ứng tuyển không hợp lệ.");
  }
  if (values.applyUrl && !/^https?:\/\//i.test(values.applyUrl)) {
    return fail("Link ứng tuyển phải bắt đầu bằng http:// hoặc https://");
  }
  if (values.companyUrl && !/^https?:\/\//i.test(values.companyUrl)) {
    return fail("Website công ty phải bắt đầu bằng http:// hoặc https://");
  }

  // Budget
  const budgetMin = values.budgetMin
    ? Number.parseInt(values.budgetMin, 10)
    : null;
  const budgetMax = values.budgetMax
    ? Number.parseInt(values.budgetMax, 10)
    : null;
  if (
    (budgetMin != null && Number.isNaN(budgetMin)) ||
    (budgetMax != null && Number.isNaN(budgetMax))
  ) {
    return fail("Ngân sách phải là số.");
  }
  if (
    (budgetMin != null && budgetMin < 0) ||
    (budgetMax != null && budgetMax < 0)
  ) {
    return fail("Ngân sách không được âm.");
  }
  if (
    (budgetMin != null && budgetMin > LIMITS.budgetMax) ||
    (budgetMax != null && budgetMax > LIMITS.budgetMax)
  ) {
    return fail("Ngân sách quá lớn.");
  }
  if (budgetMin != null && budgetMax != null && budgetMin > budgetMax) {
    return fail("Ngân sách tối thiểu không được lớn hơn tối đa.");
  }

  return {
    ok: true,
    values,
    data: {
      title: values.title,
      company: values.company,
      companyUrl: values.companyUrl || null,
      category: values.category,
      location: values.location,
      workType: values.workType,
      engagement: values.engagement,
      budgetMin,
      budgetMax,
      currency: values.currency,
      description: values.description,
      skills: values.skills,
      applyUrl: values.applyUrl || null,
      applyEmail: values.applyEmail || null,
    },
  };
}
