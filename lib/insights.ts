import { prisma } from "@/lib/db";
import { parseSkills } from "@/lib/jobs";

// Aggregates for the data-driven market report (GĐ2 task 8). Everything is
// computed live from published listings, so the article can never drift from
// the data it cites.

export type MarketInsights = {
  totalJobs: number;
  totalCompanies: number;
  totalProfiles: number;
  remoteShare: number; // % of published jobs with workType Remote
  categories: { name: string; count: number; share: number }[];
  topSkills: { name: string; count: number }[];
  locations: { name: string; count: number }[];
  engagements: { name: string; count: number }[];
  // USD project budgets (min/max midpoint), rounded.
  usdBudget: { median: number; min: number; max: number; sampled: number } | null;
};

export async function getMarketInsights(): Promise<MarketInsights> {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    select: {
      company: true,
      category: true,
      location: true,
      workType: true,
      engagement: true,
      skills: true,
      budgetMin: true,
      budgetMax: true,
      currency: true,
    },
  });
  const totalProfiles = await prisma.freelancerProfile.count({
    where: { visibility: "PUBLIC" },
  });

  const totalJobs = jobs.length;
  const companies = new Set(jobs.map((j) => j.company));
  const remote = jobs.filter((j) => j.workType === "Remote").length;

  const countBy = (key: (j: (typeof jobs)[number]) => string) => {
    const map = new Map<string, number>();
    for (const j of jobs) {
      const k = key(j);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const categories = countBy((j) => j.category).map((c) => ({
    ...c,
    share: totalJobs ? Math.round((c.count / totalJobs) * 100) : 0,
  }));

  const skillMap = new Map<string, number>();
  for (const j of jobs) {
    for (const s of parseSkills(j.skills)) {
      const k = s.trim();
      if (k) skillMap.set(k, (skillMap.get(k) ?? 0) + 1);
    }
  }
  const topSkills = [...skillMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Budget stats over USD project-based listings only, so units are comparable.
  const usdBudgets = jobs
    .filter(
      (j) =>
        j.currency === "USD" &&
        j.engagement !== "Part-time" &&
        (j.budgetMin != null || j.budgetMax != null),
    )
    .map((j) => {
      const lo = j.budgetMin ?? j.budgetMax ?? 0;
      const hi = j.budgetMax ?? j.budgetMin ?? 0;
      return Math.round((lo + hi) / 2);
    })
    .sort((a, b) => a - b);

  const usdBudget =
    usdBudgets.length >= 3
      ? {
          median: usdBudgets[Math.floor(usdBudgets.length / 2)],
          min: usdBudgets[0],
          max: usdBudgets[usdBudgets.length - 1],
          sampled: usdBudgets.length,
        }
      : null;

  return {
    totalJobs,
    totalCompanies: companies.size,
    totalProfiles,
    remoteShare: totalJobs ? Math.round((remote / totalJobs) * 100) : 0,
    categories,
    topSkills,
    locations: countBy((j) => j.location),
    engagements: countBy((j) => j.engagement),
    usdBudget,
  };
}
