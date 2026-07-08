import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getJobs, type JobFilters } from "@/lib/jobs";
import { getLandingBySlug, LANDING_PAGES } from "@/lib/landing";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { JobCard } from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";

// Job lists come from the database at request time (same reason as sitemap.ts:
// the DB isn't guaranteed reachable during the build/export step).
export const dynamic = "force-dynamic";

type Params = { slug: string };
type SearchParams = { page?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingBySlug(slug);
  if (!page) notFound();
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/viec-lam/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url: `/viec-lam/${page.slug}`,
    },
  };
}

export default async function LandingPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ slug }, { page: pageParam }] = await Promise.all([
    params,
    searchParams,
  ]);
  const landing = getLandingBySlug(slug);
  if (!landing) notFound();

  const pageNum = Number.parseInt(pageParam ?? "1", 10);
  const filters: JobFilters = {
    ...landing.filter,
    page: Number.isNaN(pageNum) ? 1 : pageNum,
  };
  const { jobs, total, page, totalPages } = await getJobs(filters);

  // Cross-links: same-group pages first, then a taste of the other groups.
  const related = LANDING_PAGES.filter((p) => p.slug !== landing.slug)
    .sort((a, b) =>
      (a.group === landing.group ? 0 : 1) - (b.group === landing.group ? 0 : 1),
    )
    .slice(0, 8);

  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Trang chủ", url: "/" },
    { name: "Việc làm theo danh mục", url: "/viec-lam" },
    { name: landing.h1, url: `/viec-lam/${landing.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-accent">
          Trang chủ
        </Link>
        <span aria-hidden className="text-subtle">/</span>
        <Link href="/viec-lam" className="transition-colors hover:text-accent">
          Việc làm theo danh mục
        </Link>
        <span aria-hidden className="text-subtle">/</span>
        <span className="text-fg">{landing.title}</span>
      </nav>

      <h1 className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        {landing.h1}
      </h1>
      <p className="mt-4 max-w-3xl text-muted">{landing.intro}</p>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold tracking-tight text-fg">
          Tin đang tuyển
          <span className="ml-2 text-sm font-normal text-muted">({total})</span>
        </h2>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6 rounded-2xl glass border-dashed border-line-strong p-12 text-center">
          <p className="text-muted">
            Chưa có tin nào trong danh mục này. Đăng ký nhận email để biết ngay
            khi có việc mới.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
          >
            Xem tất cả việc làm
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            basePath={`/viec-lam/${landing.slug}`}
          />
        </>
      )}

      {/* Internal links between landing pages */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">
          Danh mục liên quan
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {related.map((p) => (
            <Link key={p.slug} href={`/viec-lam/${p.slug}`} className="chip">
              {p.title}
            </Link>
          ))}
        </div>
        <Link
          href="/post"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          Bạn đang tuyển vị trí này? Đăng tin miễn phí
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
        </Link>
      </section>
    </div>
  );
}
