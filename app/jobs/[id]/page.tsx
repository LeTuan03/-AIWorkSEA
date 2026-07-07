import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Star,
  Wallet,
  Briefcase,
  Clock,
  MapPin,
  ArrowRight,
  BookmarkPlus,
} from "lucide-react";
import {
  getJob,
  getSimilarJobs,
  formatBudget,
  parseSkills,
  timeAgo,
} from "@/lib/jobs";
import { LOCATION_LABELS } from "@/lib/constants";
import { buildJobPostingJsonLd } from "@/lib/seo";
import { CategoryIcon } from "@/components/CategoryIcon";
import { JobCard } from "@/components/JobCard";
import { ShareButtons } from "@/components/ShareButtons";
import { trackJobAction } from "@/app/tracker/actions";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  // Trigger a real 404 during the metadata phase (before streaming) so
  // unpublished jobs don't leak their title/OG tags and the status is 404.
  if (!job || job.status !== "PUBLISHED") notFound();
  const description = job.description.slice(0, 155);
  return {
    title: `${job.title} · ${job.company}`,
    description,
    alternates: { canonical: `/jobs/${id}` },
    openGraph: {
      title: `${job.title} · ${job.company}`,
      description,
      type: "article",
      url: `/jobs/${id}`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job || job.status !== "PUBLISHED") notFound();

  const jsonLd = buildJobPostingJsonLd(job);
  const skills = parseSkills(job.skills);
  const similar = await getSimilarJobs(job, 3);
  const companyHref = `/companies/${encodeURIComponent(job.company)}`;
  const applyHref = job.applyUrl
    ? job.applyUrl
    : job.applyEmail
      ? `mailto:${job.applyEmail}?subject=${encodeURIComponent(`Ứng tuyển: ${job.title}`)}`
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-accent">Trang chủ</Link>
        <span aria-hidden className="text-subtle">/</span>
        <Link href={`/?category=${encodeURIComponent(job.category)}#jobs`} className="transition-colors hover:text-accent">
          {job.category}
        </Link>
        <span aria-hidden className="text-subtle">/</span>
        <span className="truncate text-fg">{job.title}</span>
      </nav>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl glass p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-accent">
                <CategoryIcon category={job.category} size={14} />
                {job.category}
              </span>
              {job.featured && (
                <span className="chip chip-accent">
                  <Star size={12} strokeWidth={2} className="fill-current" aria-hidden />
                  Nổi bật
                </span>
              )}
              <span className="text-xs text-subtle">Đăng {timeAgo(job.createdAt)}</span>
            </div>

            <h1 className="font-display mt-3 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {job.title}
            </h1>
            <p className="mt-1 text-muted">
              <Link href={companyHref} className="font-medium text-accent hover:underline">
                {job.company}
              </Link>{" "}
              · {LOCATION_LABELS[job.location] ?? job.location}
            </p>

            <hr className="my-6 border-line" />

            <h2 className="font-display text-sm font-semibold text-fg">
              Mô tả công việc
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">
              {job.description}
            </p>

            <h2 className="font-display mt-8 text-sm font-semibold text-fg">
              Kỹ năng yêu cầu
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>

            <hr className="my-6 border-line" />
            <ShareButtons title={`${job.title} · ${job.company}`} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl glass p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-muted">
                  <Wallet size={15} strokeWidth={1.75} aria-hidden /> Ngân sách
                </dt>
                <dd className="font-display mt-1 text-xl font-bold text-fg">
                  {formatBudget(job)}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="flex items-center gap-1.5 text-muted">
                    <Briefcase size={15} strokeWidth={1.75} aria-hidden /> Hình thức
                  </dt>
                  <dd className="mt-1 font-medium text-fg">{job.workType}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-muted">
                    <Clock size={15} strokeWidth={1.75} aria-hidden /> Hợp đồng
                  </dt>
                  <dd className="mt-1 font-medium text-fg">{job.engagement}</dd>
                </div>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted">
                  <MapPin size={15} strokeWidth={1.75} aria-hidden /> Địa điểm
                </dt>
                <dd className="mt-1 font-medium text-fg">
                  {LOCATION_LABELS[job.location] ?? job.location}
                </dd>
              </div>
            </dl>

            {applyHref ? (
              <a
                href={applyHref}
                target={job.applyUrl ? "_blank" : undefined}
                rel={job.applyUrl ? "noopener noreferrer" : undefined}
                aria-label={`Ứng tuyển vị trí ${job.title} tại ${job.company}`}
                className="btn btn-primary mt-6 w-full"
              >
                Ứng tuyển ngay
              </a>
            ) : (
              <p className="mt-6 rounded-xl bg-surface-2 px-4 py-3 text-center text-sm text-muted">
                Chưa có thông tin ứng tuyển
              </p>
            )}
            <p className="mt-3 text-center text-xs text-subtle">
              Ứng tuyển trực tiếp với nhà tuyển dụng
            </p>

            <form action={trackJobAction} className="mt-4">
              <input type="hidden" name="jobId" value={job.id} />
              <button type="submit" className="btn btn-secondary w-full">
                <BookmarkPlus size={16} strokeWidth={1.75} aria-hidden />
                Lưu vào bảng theo dõi
              </button>
            </form>

            <Link
              href={companyHref}
              className="btn btn-secondary mt-4 w-full"
            >
              Xem hồ sơ {job.company}
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </aside>
      </div>

      {/* Similar jobs */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold tracking-tight text-fg">Việc tương tự</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {similar.map((s) => (
              <JobCard key={s.id} job={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
