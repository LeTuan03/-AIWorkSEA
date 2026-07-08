import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

// Reflect newly published jobs on each request.
export const dynamic = "force-dynamic";

const XML_ESCAPES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => XML_ESCAPES[c] ?? c);
}

export async function GET() {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const items = jobs
    .map(
      (j) => `    <item>
      <title>${escapeXml(`${j.title} · ${j.company}`)}</title>
      <link>${SITE_URL}/jobs/${j.id}</link>
      <guid isPermaLink="true">${SITE_URL}/jobs/${j.id}</guid>
      <category>${escapeXml(j.category)}</category>
      <pubDate>${j.createdAt.toUTCString()}</pubDate>
      <description>${escapeXml(j.description.slice(0, 300))}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AIWORK SEA · Việc làm AI &amp; Automation</title>
    <link>${SITE_URL}</link>
    <description>Việc làm freelancer AI &amp; Automation mới nhất ở Đông Nam Á</description>
    <language>vi</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
