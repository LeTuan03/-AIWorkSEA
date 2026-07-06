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

// Sort options for the job list.
export const SORTS = [
  { value: "newest", label: "Mới nhất" },
  { value: "budget_desc", label: "Ngân sách: cao → thấp" },
  { value: "budget_asc", label: "Ngân sách: thấp → cao" },
] as const;

export function isValidSort(v: string): boolean {
  return SORTS.some((s) => s.value === v);
}
