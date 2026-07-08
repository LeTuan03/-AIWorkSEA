import fs from "fs";
import path from "path";
import { SITE_URL } from "../lib/seo";
import { LANDING_PAGES } from "../lib/landing";

type UrlEntry = { loc: string; changefreq?: string; priority?: number; lastmod?: string };

function buildXml(urls: UrlEntry[]) {
  const body = urls
    .map((u) => {
      const parts = [`<loc>${u.loc}</loc>`];
      if (u.lastmod) parts.push(`<lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) parts.push(`<changefreq>${u.changefreq}</changefreq>`);
      if (u.priority != null) parts.push(`<priority>${u.priority}</priority>`);
      return `<url>\n${parts.join("\n")}\n</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

async function main() {
  const staticUrls: UrlEntry[] = [
    { loc: SITE_URL, changefreq: "hourly", priority: 1 },
    { loc: `${SITE_URL}/freelancers`, changefreq: "daily", priority: 0.7 },
    { loc: `${SITE_URL}/companies`, changefreq: "daily", priority: 0.6 },
    { loc: `${SITE_URL}/tools/quote`, changefreq: "monthly", priority: 0.4 },
    { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: 0.4 },
    { loc: `${SITE_URL}/insights/thi-truong-freelancer-ai-dong-nam-a`, changefreq: "weekly", priority: 0.6 },
    { loc: `${SITE_URL}/viec-lam`, changefreq: "daily", priority: 0.7 },
  ];

  const landingUrls: UrlEntry[] = LANDING_PAGES.map((p) => ({
    loc: `${SITE_URL}/viec-lam/${p.slug}`,
    changefreq: "daily",
    priority: 0.7,
  }));

  const urls = [...staticUrls, ...landingUrls];

  const xml = buildXml(urls);

  const outDir = path.join(process.cwd(), "public");
  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf8");
    // eslint-disable-next-line no-console
    console.log("Generated public/sitemap.xml with", urls.length, "URLs");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to write sitemap.xml", err);
    process.exit(1);
  }
}

main();
