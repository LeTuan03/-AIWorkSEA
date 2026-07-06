import Link from "next/link";
import type { Metadata } from "next";
import { Plus, Star, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getJobsByUser, formatBudget, timeAgo } from "@/lib/jobs";
import { STATUS_LABELS, LOCATION_LABELS } from "@/lib/constants";
import { ConfirmForm } from "@/components/ConfirmForm";
import { closeJobAction } from "./actions";

export const metadata: Metadata = {
  title: "Bảng điều khiển",
  robots: { index: false },
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-warn-weak text-warn",
  PUBLISHED: "bg-success-weak text-success",
  CLOSED: "bg-surface-2 text-muted",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const jobs = await getJobsByUser(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            Tin của bạn
          </h1>
          <p className="mt-1 text-sm text-muted">Đăng nhập bằng {user.email}</p>
        </div>
        <Link href="/post" className="btn btn-primary">
          <Plus size={16} strokeWidth={2} aria-hidden />
          Đăng tin mới
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl glass border-dashed border-line-strong p-12 text-center">
          <p className="text-muted">Bạn chưa đăng tin nào.</p>
          <Link
            href="/post"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Đăng tin đầu tiên
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {jobs.map((job) => (
            <li key={job.id} className="rounded-2xl glass p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${
                        statusStyles[job.status] ?? "bg-surface-2 text-muted"
                      }`}
                    >
                      {STATUS_LABELS[job.status] ?? job.status}
                    </span>
                    {job.featured && (
                      <span className="chip chip-accent">
                        <Star size={12} strokeWidth={2} className="fill-current" aria-hidden />
                        Nổi bật
                      </span>
                    )}
                    <span className="text-xs text-subtle">{timeAgo(job.createdAt)}</span>
                  </div>
                  <h3 className="font-display mt-2 font-semibold text-fg">{job.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">
                    {job.company} · {LOCATION_LABELS[job.location] ?? job.location}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-fg">
                    {formatBudget(job)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {job.status === "PUBLISHED" && (
                    <Link
                      href={`/jobs/${job.id}`}
                      className="rounded-xl border border-line-strong px-3 py-1.5 text-sm font-medium text-fg transition hover:bg-surface-2"
                    >
                      Xem
                    </Link>
                  )}
                  {job.status !== "CLOSED" && (
                    <>
                      <Link
                        href={`/dashboard/jobs/${job.id}/edit`}
                        className="rounded-xl border border-line-strong px-3 py-1.5 text-sm font-medium text-fg transition hover:bg-surface-2"
                      >
                        Sửa
                      </Link>
                      <ConfirmForm
                        action={closeJobAction}
                        fields={{ jobId: job.id }}
                        label="Đóng"
                        buttonClassName="rounded-xl border border-line-strong px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger-weak"
                        confirmTitle="Đóng tin này?"
                        confirmText="Tin sẽ bị ẩn khỏi trang chủ và không nhận ứng tuyển nữa."
                        confirmLabel="Đóng tin"
                      />
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
