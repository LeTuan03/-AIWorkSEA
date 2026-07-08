import Link from "next/link";
import {
  Globe,
  FilePlus2,
  Search,
  Handshake,
  Star,
  UserPlus,
  BadgeCheck,
} from "lucide-react";
import {
  getJobs,
  getStats,
  getCategoryCounts,
  getFeaturedJobs,
  formatBudget,
  type JobSort,
} from "@/lib/jobs";
import { CATEGORIES, isValidSort } from "@/lib/constants";
import { buildWebSiteJsonLd, buildOrganizationJsonLd } from "@/lib/seo";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Filters } from "@/components/Filters";
import { JobCard } from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { NewsletterForm } from "@/components/NewsletterForm";

type SearchParams = {
  q?: string;
  category?: string;
  location?: string;
  sort?: string;
  remote?: string;
  page?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sort: JobSort = isValidSort(params.sort ?? "")
    ? (params.sort as JobSort)
    : "newest";
  const remote = params.remote === "1";
  const pageNum = Number.parseInt(params.page ?? "1", 10);
  const isFiltered = Boolean(
    params.q || params.category || params.location || remote || (params.sort && params.sort !== "newest"),
  );

  const [{ jobs, total, page, totalPages }, stats, catCounts, featured] =
    await Promise.all([
      getJobs({
        q: params.q,
        category: params.category,
        location: params.location,
        remote,
        sort,
        page: Number.isNaN(pageNum) ? 1 : pageNum,
      }),
      getStats(),
      getCategoryCounts(),
      getFeaturedJobs(3),
    ]);

  const showBrowse = !isFiltered && page === 1;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildWebSiteJsonLd(),
            buildOrganizationJsonLd(),
          ]),
        }}
      />

      {/* Hero (§8: content + floating glass cards) */}
      <section className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 py-16 sm:py-20 lg:min-h-[calc(100dvh-72px)] lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left: content */}
          <div>
            <span className="chip chip-accent">
              <Globe size={14} strokeWidth={1.75} />
              AI Jobs & Freelance
            </span>

            <h1 className="font-display mt-6 text-5xl font-bold leading-[1.03] tracking-tight text-fg sm:text-6xl lg:text-7xl">
              Kết nối doanh nghiệp với{" "}
              <span className="text-accent">AI Freelancer</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Nền tảng tuyển dụng dành riêng cho AI, Machine Learning, LLM, Automation và Data.
              Tìm việc freelance, remote hoặc contract nhanh chóng.
            </p>

            {/* Search (primary action) */}
            <form
              method="GET"
              action="/"
              className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  name="q"
                  type="text"
                  aria-label="Từ khóa tìm việc"
                  placeholder="Kỹ năng hoặc chức danh (RAG, n8n, Computer Vision)"
                  className="field pl-11 text-base"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Tìm việc
              </button>
            </form>

            {/* Social proof (§8) */}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                { n: stats.jobs, l: "việc đang tuyển" },
                { n: stats.companies, l: "nhà tuyển dụng" },
                { n: stats.countries, l: "quốc gia + Remote" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl font-bold text-fg">{s.n}</dt>
                  <dd className="text-sm text-muted">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: floating glass cards (§8) */}
          <div className="relative hidden h-[440px] lg:block" aria-hidden>
            <div className="floaty absolute right-0 top-2 w-72 rounded-2xl glass p-5">
              {featured[0] ? (
                <>
                  <span className="chip chip-accent">
                    <Star size={12} strokeWidth={2} className="fill-current" />
                    Nổi bật
                  </span>
                  <div className="font-display mt-3 line-clamp-2 font-semibold text-fg">
                    {featured[0].title}
                  </div>
                  <div className="mt-1 text-sm text-muted">{featured[0].company}</div>
                  <div className="font-display mt-3 font-bold text-fg">
                    {formatBudget(featured[0])}
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
                    <CategoryIcon category={CATEGORIES[0]} size={20} />
                  </span>
                  <div className="font-display mt-3 font-semibold text-fg">{CATEGORIES[0]}</div>
                  <div className="mt-1 text-sm text-muted">{catCounts[CATEGORIES[0]] ?? 0} việc</div>
                </>
              )}
            </div>

            <div
              className="floaty absolute left-2 top-44 w-60 rounded-2xl glass p-5"
              style={{ animationDelay: "-2s" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
                <CategoryIcon category={CATEGORIES[1]} size={20} />
              </span>
              <div className="font-display mt-3 font-semibold text-fg">{CATEGORIES[1]}</div>
              <div className="mt-1 text-sm text-muted">{catCounts[CATEGORIES[1]] ?? 0} việc</div>
            </div>

            <div
              className="floaty absolute bottom-2 right-10 w-56 rounded-2xl glass p-5"
              style={{ animationDelay: "-4s" }}
            >
              <div className="font-display text-3xl font-bold text-fg">{stats.jobs}</div>
              <div className="mt-1 text-sm text-muted">việc AI &amp; Automation đang mở</div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by category */}
      {showBrowse && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Duyệt theo lĩnh vực
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/?category=${encodeURIComponent(c)}#jobs`}
                className="lift rounded-2xl glass p-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
                  <CategoryIcon category={c} size={20} />
                </span>
                <div className="mt-3 text-sm font-semibold text-fg">{c}</div>
                <div className="text-xs text-muted">{catCounts[c] ?? 0} việc</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {showBrowse && featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-4">
          <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Tin nổi bật
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* Jobs */}
      <section id="jobs" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10">
        <Filters
          q={params.q}
          category={params.category}
          location={params.location}
          sort={params.sort}
          remote={remote}
        />

        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-fg">
            {isFiltered ? "Kết quả" : "Việc làm mới nhất"}
            <span className="ml-2 text-sm font-normal text-muted">({total})</span>
          </h2>
        </div>

        {jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl glass border-dashed border-line-strong p-12 text-center">
            <p className="text-muted">Không tìm thấy việc làm phù hợp.</p>
            <Link
              href="/"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Xóa bộ lọc
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
              basePath="/"
              hash="#jobs"
              query={{
                q: params.q,
                category: params.category,
                location: params.location,
                sort: params.sort && params.sort !== "newest" ? params.sort : undefined,
                remote: remote ? "1" : undefined,
              }}
            />
          </>
        )}
      </section>

      {/* How it works */}
      {!isFiltered && (
        <section id="how" className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Cách hoạt động
            </h2>
            <div className="mt-8 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-2xl glass sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                {
                  Icon: FilePlus2,
                  title: "Nhà tuyển dụng đăng tin",
                  body: "Tạo tài khoản, mô tả dự án AI/Automation, ngân sách và cách ứng tuyển. Đăng miễn phí, tin được kiểm duyệt trước khi hiển thị.",
                },
                {
                  Icon: Search,
                  title: "Freelancer tìm & ứng tuyển",
                  body: "Lọc theo lĩnh vực, địa điểm, từ khóa rồi ứng tuyển trực tiếp qua link hoặc email của nhà tuyển dụng.",
                },
                {
                  Icon: Handshake,
                  title: "Làm việc trực tiếp",
                  body: "Nền tảng không giữ tiền, không trung gian thanh toán. Hai bên tự thỏa thuận, rủi ro thấp và nhanh gọn.",
                },
              ].map((item) => (
                <div key={item.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
                    <item.Icon size={22} strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 font-semibold text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Freelancer profile CTA (GĐ1: seed the supply side) */}
      {!isFiltered && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="rounded-2xl glass p-8 sm:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <span className="chip chip-accent">
                    <BadgeCheck size={14} strokeWidth={1.75} aria-hidden />
                    Dành cho freelancer
                  </span>
                  <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                    Tạo hồ sơ miễn phí — được nhà tuyển dụng chủ động liên hệ
                  </h2>
                  <p className="mt-3 max-w-xl text-muted">
                    Hồ sơ công khai với kỹ năng, portfolio và mức giá tham khảo.
                    Nhà tuyển dụng AI &amp; Automation tìm thấy bạn qua Google và
                    danh sách freelancer — không cần chờ tin đăng phù hợp.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/freelancer/edit" className="btn btn-primary">
                      <UserPlus size={16} strokeWidth={2} aria-hidden />
                      Tạo hồ sơ trong 2 phút
                    </Link>
                    <Link href="/freelancers" className="btn btn-secondary">
                      Xem các freelancer khác
                    </Link>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-muted">
                  {[
                    "Miễn phí, không giữ tiền, không trung gian",
                    "Trang hồ sơ riêng chuẩn SEO: aiworksea.../freelancer/ban",
                    "Theo dõi ứng tuyển bằng bảng Kanban tích hợp",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <BadgeCheck
                        size={16}
                        strokeWidth={1.75}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      {!isFiltered && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Nhận việc mới qua email
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              AI Jobs Digest — tổng hợp việc AI &amp; Automation mới hằng tuần.
              Miễn phí, hủy bất cứ lúc nào.
            </p>
            <div className="mx-auto mt-6 max-w-md text-left">
              <NewsletterForm source="home" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
