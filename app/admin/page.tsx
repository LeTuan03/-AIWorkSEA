import Link from "next/link";
import type { Job } from "@prisma/client";
import type { Metadata } from "next";
import { Check, Star } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getJobsByStatus, formatBudget, timeAgo } from "@/lib/jobs";
import { LOCATION_LABELS } from "@/lib/constants";
import { ConfirmForm } from "@/components/ConfirmForm";
import {
  approveJobAction,
  rejectJobAction,
  toggleFeaturedAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Quản trị",
  robots: { index: false },
};

function JobMeta({ job }: { job: Job }) {
  return (
    <>
      <p className="mt-0.5 text-sm text-muted">{job.company}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <span className="chip">{job.category}</span>
        <span className="chip">{LOCATION_LABELS[job.location] ?? job.location}</span>
        <span className="chip">{formatBudget(job)}</span>
      </div>
    </>
  );
}

export default async function AdminPage() {
  await requireAdmin();

  const [pending, published] = await Promise.all([
    getJobsByStatus("PENDING"),
    getJobsByStatus("PUBLISHED"),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
          Quản trị · Kiểm duyệt
        </h1>
        <div className="flex gap-2">
          <Link href="/admin/stats" className="btn btn-secondary">
            Số liệu
          </Link>
          <Link href="/admin/metrics" className="btn btn-secondary">
            Mốc kích hoạt
          </Link>
          <Link href="/admin/freelancers" className="btn btn-secondary">
            Hồ sơ
          </Link>
        </div>
      </div>

      {/* Moderation queue */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-fg">
          Chờ duyệt
          <span className="ml-2 text-sm font-normal text-muted">
            ({pending.length})
          </span>
        </h2>

        {pending.length === 0 ? (
          <p className="mt-4 rounded-2xl glass border-dashed border-line-strong p-8 text-center text-sm text-muted">
            Không có tin nào chờ duyệt.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pending.map((job) => (
              <li key={job.id} className="rounded-2xl glass p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs text-subtle">{timeAgo(job.createdAt)}</span>
                    <h3 className="font-display mt-1 font-semibold text-fg">{job.title}</h3>
                    <JobMeta job={job} />
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <form action={approveJobAction}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        <Check size={15} strokeWidth={2.25} aria-hidden />
                        Duyệt
                      </button>
                    </form>
                    <ConfirmForm
                      action={rejectJobAction}
                      fields={{ jobId: job.id }}
                      label="Từ chối"
                      buttonClassName="rounded-xl border border-line-strong px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger-weak"
                      confirmTitle="Từ chối tin này?"
                      confirmText="Tin sẽ bị đóng và không hiển thị."
                      confirmLabel="Từ chối"
                    />
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-muted">
                  {job.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Published listings */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-fg">
          Đang hiển thị
          <span className="ml-2 text-sm font-normal text-muted">
            ({published.length})
          </span>
        </h2>

        {published.length === 0 ? (
          <p className="mt-4 rounded-2xl glass border-dashed border-line-strong p-8 text-center text-sm text-muted">
            Chưa có tin nào hiển thị.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {published.map((job) => (
              <li key={job.id} className="rounded-2xl glass p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {job.featured && (
                        <span className="chip chip-accent">
                          <Star size={12} strokeWidth={2} className="fill-current" aria-hidden />
                          Nổi bật
                        </span>
                      )}
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-display font-semibold text-fg transition-colors hover:text-accent"
                      >
                        {job.title}
                      </Link>
                    </div>
                    <JobMeta job={job} />
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <form action={toggleFeaturedAction}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                          job.featured
                            ? "bg-accent-weak text-accent-weak-fg hover:opacity-80"
                            : "border border-line-strong text-fg hover:bg-surface-2"
                        }`}
                      >
                        <Star
                          size={14}
                          strokeWidth={2}
                          className={job.featured ? "fill-current" : ""}
                          aria-hidden
                        />
                        {job.featured ? "Bỏ nổi bật" : "Nổi bật"}
                      </button>
                    </form>
                    <ConfirmForm
                      action={rejectJobAction}
                      fields={{ jobId: job.id }}
                      label="Gỡ"
                      buttonClassName="rounded-xl border border-line-strong px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger-weak"
                      confirmTitle="Gỡ tin này?"
                      confirmText="Tin sẽ bị đóng và ẩn khỏi trang chủ."
                      confirmLabel="Gỡ tin"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
