// Shared taxonomy for the whole app. Seed data, filters, and the post form all
// import from here so the vocabulary never drifts apart.

export const CATEGORIES = [
  "AI/ML Engineering",
  "LLM & Prompt Engineering",
  "Automation / RPA",
  "Data Engineering",
  "Computer Vision",
  "Conversational AI / Chatbot",
  "MLOps",
  "AI Product / Strategy",
] as const;

export const LOCATIONS = [
  "Remote",
  "Vietnam",
  "Singapore",
  "Indonesia",
  "Thailand",
  "Philippines",
  "Malaysia",
] as const;

export const WORK_TYPES = ["Remote", "Hybrid", "Onsite"] as const;

export const ENGAGEMENTS = [
  "Freelance",
  "Contract",
  "Part-time",
  "Project-based",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Location = (typeof LOCATIONS)[number];
export type WorkType = (typeof WORK_TYPES)[number];
export type Engagement = (typeof ENGAGEMENTS)[number];

// Plain geographic labels. Icons/flags are handled by the UI layer, not baked
// into copy, so strings stay emoji-free and screen-reader clean.
export const LOCATION_LABELS: Record<string, string> = {
  Remote: "Remote",
  Vietnam: "Vietnam",
  Singapore: "Singapore",
  Indonesia: "Indonesia",
  Thailand: "Thailand",
  Philippines: "Philippines",
  Malaysia: "Malaysia",
};

export function isValidCategory(v: string): v is Category {
  return (CATEGORIES as readonly string[]).includes(v);
}
export function isValidLocation(v: string): v is Location {
  return (LOCATIONS as readonly string[]).includes(v);
}
export function isValidWorkType(v: string): v is WorkType {
  return (WORK_TYPES as readonly string[]).includes(v);
}
export function isValidEngagement(v: string): v is Engagement {
  return (ENGAGEMENTS as readonly string[]).includes(v);
}

export const CURRENCIES = ["USD", "VND", "SGD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export function isValidCurrency(v: string): v is Currency {
  return (CURRENCIES as readonly string[]).includes(v);
}

// Maximum input lengths / values — enforced server-side to prevent storage
// abuse and unbounded-input DoS, mirrored as `maxLength` on the form inputs.
export const LIMITS = {
  title: 120,
  company: 100,
  companyUrl: 500,
  description: 6000,
  skills: 300,
  applyUrl: 500,
  applyEmail: 200,
  budgetMax: 100_000_000,
} as const;

export const STATUSES = ["PENDING", "PUBLISHED", "CLOSED"] as const;
export type JobStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ duyệt",
  PUBLISHED: "Đang hiển thị",
  CLOSED: "Đã đóng",
};

// ISO 3166 country codes for schema.org JobPosting structured data.
export const COUNTRY_CODES: Record<string, string> = {
  Vietnam: "VN",
  Singapore: "SG",
  Indonesia: "ID",
  Thailand: "TH",
  Philippines: "PH",
  Malaysia: "MY",
};

// Map our engagement types to schema.org employmentType enum values.
export const EMPLOYMENT_TYPES: Record<string, string> = {
  Freelance: "CONTRACTOR",
  Contract: "CONTRACTOR",
  "Part-time": "PART_TIME",
  "Project-based": "CONTRACTOR",
};

// ---- Freelancer profiles (Part A.1) ----

export const AVAILABILITY = ["OPEN", "BUSY", "HIDDEN"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export const AVAILABILITY_LABELS: Record<string, string> = {
  OPEN: "Sẵn sàng nhận việc",
  BUSY: "Đang bận",
  HIDDEN: "Tạm ẩn hồ sơ",
};

export function isValidAvailability(v: string): v is Availability {
  return (AVAILABILITY as readonly string[]).includes(v);
}

export const VISIBILITY = ["PUBLIC", "UNLISTED"] as const;
export type Visibility = (typeof VISIBILITY)[number];

export const VISIBILITY_LABELS: Record<string, string> = {
  PUBLIC: "Công khai (hiện trong danh sách + Google)",
  UNLISTED: "Ẩn khỏi danh sách (chỉ ai có link mới xem được)",
};

export function isValidVisibility(v: string): v is Visibility {
  return (VISIBILITY as readonly string[]).includes(v);
}

// Lowercase slug for /freelancer/[username].
export const USERNAME_RE = /^[a-z0-9-]{3,30}$/;

export const PROFILE_LIMITS = {
  username: 30,
  displayName: 80,
  headline: 120,
  bio: 2000,
  skills: 300,
  portfolioUrl: 500,
  avatarUrl: 500,
  rateReference: 60,
  contactEmail: 200,
  contactPhone: 30,
} as const;

// ---- Application tracker / mini kanban (Part A.4) ----

export const TRACKER_COLUMNS = [
  { key: "SENT", label: "Đã gửi" },
  { key: "TALKING", label: "Đang trao đổi" },
  { key: "OFFER", label: "Đã nhận" },
  { key: "REJECTED", label: "Từ chối" },
] as const;

export type TrackerColumn = (typeof TRACKER_COLUMNS)[number]["key"];

export function isValidColumn(v: string): v is TrackerColumn {
  return TRACKER_COLUMNS.some((c) => c.key === v);
}

export const CARD_LIMITS = {
  title: 200,
  company: 120,
  link: 500,
  notes: 1000,
} as const;

// Sort options for the job list.
export const SORTS = [
  { value: "newest", label: "Mới nhất" },
  { value: "budget_desc", label: "Ngân sách: cao → thấp" },
  { value: "budget_asc", label: "Ngân sách: thấp → cao" },
] as const;

export function isValidSort(v: string): boolean {
  return SORTS.some((s) => s.value === v);
}
