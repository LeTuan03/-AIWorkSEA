import { Prisma, type Job } from "@prisma/client";
import { prisma } from "@/lib/db";

export const PAGE_SIZE = 12;

export type JobSort = "newest" | "budget_desc" | "budget_asc";

export type JobFilters = {
  q?: string;
  category?: string;
  location?: string;
  company?: string;
  remote?: boolean;
  sort?: JobSort;
  page?: number;
  pageSize?: number;
};

export type JobListResult = {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function orderByForSort(sort: JobSort | undefined): Prisma.JobOrderByWithRelationInput[] {
  switch (sort) {
    case "budget_desc":
      return [{ budgetMax: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }];
    case "budget_asc":
      return [{ budgetMax: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }];
    default:
      // Featured float to the top only in the default (newest) ordering.
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

// Fetch published jobs with DB-level filtering + pagination. Filtering, sorting
// and LIMIT happen in Postgres, so this scales past thousands of jobs.
export async function getJobs(filters: JobFilters = {}): Promise<JobListResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const pageSize = filters.pageSize ?? PAGE_SIZE;

  const and: Prisma.JobWhereInput[] = [{ status: "PUBLISHED" }];
  if (filters.category) and.push({ category: filters.category });
  if (filters.location) and.push({ location: filters.location });
  if (filters.company) and.push({ company: filters.company });
  if (filters.remote) and.push({ workType: "Remote" });

  const q = filters.q?.trim();
  if (q) {
    and.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { skills: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.JobWhereInput = { AND: and };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: orderByForSort(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

// Featured published jobs for the homepage highlight strip.
export async function getFeaturedJobs(limit = 3): Promise<Job[]> {
  return prisma.job.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Published job count per category (for the "browse by category" tiles).
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await prisma.job.groupBy({
    by: ["category"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  const map: Record<string, number> = {};
  for (const r of rows) map[r.category] = r._count._all;
  return map;
}

export type SiteStats = {
  jobs: number;
  companies: number;
  countries: number;
};

// Headline numbers for the hero stats bar.
export async function getStats(): Promise<SiteStats> {
  const where = { status: "PUBLISHED" as const };
  const [jobs, companies, locations] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.groupBy({ by: ["company"], where }),
    prisma.job.groupBy({ by: ["location"], where }),
  ]);
  return {
    jobs,
    companies: companies.length,
    countries: locations.filter((l) => l.location !== "Remote").length,
  };
}

// Similar published jobs (same category), excluding the current one.
export async function getSimilarJobs(job: Job, limit = 3): Promise<Job[]> {
  return prisma.job.findMany({
    where: { status: "PUBLISHED", category: job.category, id: { not: job.id } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export type CompanySummary = {
  company: string;
  jobCount: number;
};

// Distinct companies with published jobs, most-active first.
export async function getCompanies(): Promise<CompanySummary[]> {
  const rows = await prisma.job.groupBy({
    by: ["company"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
    orderBy: { _count: { company: "desc" } },
  });
  return rows.map((r) => ({ company: r.company, jobCount: r._count._all }));
}

// Published jobs for a single company profile page.
export async function getJobsByCompany(company: string): Promise<Job[]> {
  return prisma.job.findMany({
    where: { status: "PUBLISHED", company },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getJob(id: string): Promise<Job | null> {
  return prisma.job.findUnique({ where: { id } });
}

// Owner's account email, for moderation notifications. Null for seeded or
// orphaned listings (owner deleted) — callers just skip sending then.
export async function getJobOwnerEmail(job: Job): Promise<string | null> {
  if (!job.userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: job.userId },
    select: { email: true },
  });
  return user?.email ?? null;
}

// All jobs owned by a recruiter (any status), for their dashboard.
export async function getJobsByUser(userId: string): Promise<Job[]> {
  return prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// Jobs in a given status (admin moderation views).
export async function getJobsByStatus(
  status: string,
  limit = 100,
): Promise<Job[]> {
  return prisma.job.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Count a user's recent posts — used for per-user posting rate limiting.
export async function countRecentJobsByUser(
  userId: string,
  sinceMs: number,
): Promise<number> {
  const since = new Date(Date.now() - sinceMs);
  return prisma.job.count({ where: { userId, createdAt: { gte: since } } });
}

export type CreateJobInput = {
  title: string;
  company: string;
  companyUrl?: string | null;
  category: string;
  location: string;
  workType: string;
  engagement: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string;
  description: string;
  skills: string;
  applyUrl?: string | null;
  applyEmail?: string | null;
  featured?: boolean;
  status?: string;
  userId?: string | null;
};

export async function createJob(input: CreateJobInput): Promise<Job> {
  return prisma.job.create({ data: input });
}

// Fields a recruiter may edit on their own listing (no status/featured here —
// editing sends a job back through moderation, handled by the caller).
export type UpdateJobInput = Omit<CreateJobInput, "userId" | "status">;

export async function updateJob(
  id: string,
  data: UpdateJobInput & { status?: string },
): Promise<Job> {
  return prisma.job.update({ where: { id }, data });
}

export async function setJobStatus(id: string, status: string): Promise<Job> {
  return prisma.job.update({ where: { id }, data: { status } });
}

export async function setJobFeatured(
  id: string,
  featured: boolean,
): Promise<Job> {
  return prisma.job.update({ where: { id }, data: { featured } });
}

// ---------- Formatting helpers (pure, shared by server + client) ----------

export function parseSkills(skills: string): string[] {
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatBudget(job: {
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  engagement: string;
}): string {
  const { budgetMin, budgetMax, currency, engagement } = job;
  if (budgetMin == null && budgetMax == null) return "Thương lượng";

  // Hourly engagements store an hourly rate; everything else is a project total.
  const isHourly = engagement === "Part-time";
  const suffix = isHourly ? "/giờ" : "";

  const fmt = (n: number) =>
    currency === "USD"
      ? `$${n.toLocaleString("en-US")}`
      : `${n.toLocaleString("vi-VN")} ${currency}`;

  if (budgetMin != null && budgetMax != null) {
    return `${fmt(budgetMin)} - ${fmt(budgetMax)}${suffix}`;
  }
  const single = (budgetMin ?? budgetMax) as number;
  return `${fmt(single)}${suffix}`;
}

export function timeAgo(date: Date): string {
  // Guard against clock skew / bad data producing a future date.
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const days = Math.floor(seconds / 86400);
  if (days <= 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  if (days < 7) return `${days} ngày trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} tuần trước`;
  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
}
