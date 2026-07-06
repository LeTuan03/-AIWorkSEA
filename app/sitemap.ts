import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, updatedAt: true, company: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const jobUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/jobs/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const companyUrls: MetadataRoute.Sitemap = [
    ...new Set(jobs.map((j) => j.company)),
  ].map((company) => ({
    url: `${SITE_URL}/companies/${encodeURIComponent(company)}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/companies`, changeFrequency: "daily", priority: 0.6 },
    ...companyUrls,
    ...jobUrls,
  ];
}
