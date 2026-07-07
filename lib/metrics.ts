import { prisma } from "@/lib/db";

// KPI layer for the Part B monetization triggers (see Urdaiworksea.md Phần F).
// Every threshold in the roadmap keys off one of these numbers, so they live in
// one place and are surfaced on /admin/metrics.

export type Metric = {
  key: string;
  label: string;
  value: number;
  target: number; // threshold that unlocks the related Part B stage
  unlocks: string; // which Part B stage this gates
  note?: string;
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export type MetricsSnapshot = {
  metrics: Metric[];
  totals: {
    profilesTotal: number;
    subscribersTotal: number;
    jobsPublished: number;
  };
};

export async function getMetrics(): Promise<MetricsSnapshot> {
  const since30 = new Date(Date.now() - THIRTY_DAYS_MS);

  const [
    jobsLast30d,
    qualityProfiles,
    confirmedSubscribers,
    paidRecruiters,
    returningRecruiters,
    profilesTotal,
    subscribersTotal,
    jobsPublished,
  ] = await Promise.all([
    // Demand: non-pending posts in the last 30 days.
    prisma.job.count({
      where: { createdAt: { gte: since30 }, status: { not: "PENDING" } },
    }),
    // Supply: profiles complete enough to sell "priority access" against later.
    prisma.freelancerProfile.count({
      where: {
        bio: { not: "" },
        skills: { not: "" },
        portfolioUrl: { not: null },
      },
    }),
    prisma.subscriber.count({ where: { status: "CONFIRMED" } }),
    // Recruiters who have actually paid for a job post.
    prisma.payment
      .findMany({
        where: { purpose: "JOB_POST", status: "PAID" },
        distinct: ["userId"],
        select: { userId: true },
      })
      .then((rows) => rows.length),
    // Recruiters who came back: 2+ jobs posted.
    prisma.job
      .groupBy({
        by: ["userId"],
        where: { userId: { not: null } },
        _count: { _all: true },
      })
      .then((rows) => rows.filter((r) => r._count._all >= 2).length),
    prisma.freelancerProfile.count(),
    prisma.subscriber.count(),
    prisma.job.count({ where: { status: "PUBLISHED" } }),
  ]);

  const metrics: Metric[] = [
    {
      key: "jobs30d",
      label: "Tin đăng / 30 ngày",
      value: jobsLast30d,
      target: 20,
      unlocks: "Giai đoạn 1 — Đăng tin trả phí",
      note: "Hoặc đạt ≥ 3.000 traffic/tháng (đo ở Umami).",
    },
    {
      key: "paidRecruiters",
      label: "Nhà tuyển dụng đã trả phí",
      value: paidRecruiters,
      target: 5,
      unlocks: "Giai đoạn 2 — Tin nổi bật",
    },
    {
      key: "qualityProfiles",
      label: "Hồ sơ freelancer chất lượng",
      value: qualityProfiles,
      target: 50,
      unlocks: "Giai đoạn 3 — Employer Profile Access",
      note: "Có bio + kỹ năng + link portfolio.",
    },
    {
      key: "subscribers",
      label: "Subscriber đã xác nhận",
      value: confirmedSubscribers,
      target: 500,
      unlocks: "Giai đoạn 4 — Newsletter Sponsor",
    },
    {
      key: "returningRecruiters",
      label: "Nhà tuyển dụng quay lại (2+ tin)",
      value: returningRecruiters,
      target: 20,
      unlocks: "Giai đoạn 5 — Employer Subscription",
    },
  ];

  return {
    metrics,
    totals: { profilesTotal, subscribersTotal, jobsPublished },
  };
}
