import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CircleUser, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getAllProfiles } from "@/lib/profiles";
import { parseSkills } from "@/lib/jobs";
import { AVAILABILITY_LABELS, VISIBILITY_LABELS } from "@/lib/constants";
import { toggleVerifiedAction } from "../actions";

export const metadata: Metadata = {
  title: "Quản trị · Hồ sơ freelancer",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function AdminFreelancersPage() {
  await requireAdmin();
  const profiles = await getAllProfiles();
  const verifiedCount = profiles.filter((p) => p.isVerified).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            Hồ sơ freelancer
          </h1>
          <p className="mt-1 text-sm text-muted">
            {profiles.length} hồ sơ · {verifiedCount} đã xác thực. Gắn badge cho
            hồ sơ đạt chất lượng (bio đầy đủ, kỹ năng rõ, có portfolio).
          </p>
        </div>
        <Link href="/admin" className="btn btn-secondary">
          Về kiểm duyệt
        </Link>
      </div>

      {profiles.length === 0 ? (
        <p className="mt-6 rounded-2xl glass border-dashed border-line-strong p-8 text-center text-sm text-muted">
          Chưa có hồ sơ nào.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {profiles.map((p) => {
            const skills = parseSkills(p.skills).slice(0, 6);
            return (
              <li key={p.id} className="rounded-2xl glass p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    {p.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.avatarUrl}
                        alt={p.displayName}
                        width={44}
                        height={44}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 shrink-0 rounded-xl border border-line object-cover"
                        style={{ height: 44, width: 44 }}
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
                        <CircleUser size={24} strokeWidth={1.5} aria-hidden />
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-semibold text-fg">
                          {p.displayName}
                        </span>
                        {p.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-success-weak px-2 py-0.5 text-xs font-semibold text-success">
                            <BadgeCheck size={12} strokeWidth={2} aria-hidden />
                            Đã xác thực
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted">
                        @{p.username}
                        {p.headline ? ` · ${p.headline}` : ""}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="chip">
                          {AVAILABILITY_LABELS[p.availability] ?? p.availability}
                        </span>
                        <span className="chip">
                          {VISIBILITY_LABELS[p.visibility] ?? p.visibility}
                        </span>
                        {p.portfolioUrl ? (
                          <span className="chip">Có portfolio</span>
                        ) : (
                          <span className="chip">Chưa có portfolio</span>
                        )}
                      </div>
                      {skills.length > 0 && (
                        <p className="mt-1.5 text-xs text-subtle">
                          {skills.join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/freelancer/${p.username}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-3 py-1.5 text-sm font-medium text-fg transition hover:bg-surface-2"
                    >
                      <ExternalLink size={14} strokeWidth={1.75} aria-hidden />
                      Xem
                    </Link>
                    <form action={toggleVerifiedAction}>
                      <input type="hidden" name="profileId" value={p.id} />
                      <input type="hidden" name="username" value={p.username} />
                      <input
                        type="hidden"
                        name="next"
                        value={p.isVerified ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                          p.isVerified
                            ? "bg-success-weak text-success hover:opacity-80"
                            : "border border-line-strong text-fg hover:bg-surface-2"
                        }`}
                      >
                        <BadgeCheck size={14} strokeWidth={2} aria-hidden />
                        {p.isVerified ? "Bỏ xác thực" : "Xác thực"}
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
