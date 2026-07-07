import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { getPublicProfiles } from "@/lib/profiles";

// Render at request time, not during the build/export step: the sitemap depends
// on the database, which isn't guaranteed to be reachable while Netlify builds.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/freelancers`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/companies`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/tools/quote`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
  ];

  let jobs: { id: string; updatedAt: Date; company: string }[] = [];
  try {
    jobs = await prisma.job.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, updatedAt: true, company: true },
      orderBy: { createdAt: "desc" },
      take: 5000,
    });
  } catch (err) {
    // If the database is unreachable, still return a valid sitemap with the
    // core static routes instead of failing the request.
    console.error("sitemap: failed to load jobs from database", err);
    return staticUrls;
  }

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

  // Public freelancer profiles (excludes UNLISTED / HIDDEN).
  let profileUrls: MetadataRoute.Sitemap = [];
  try {
    const profiles = await getPublicProfiles();
    profileUrls = profiles.map((p) => ({
      url: `${SITE_URL}/freelancer/${p.username}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (err) {
    console.error("sitemap: failed to load freelancer profiles", err);
  }

  return [...staticUrls, ...companyUrls, ...profileUrls, ...jobUrls];
}
