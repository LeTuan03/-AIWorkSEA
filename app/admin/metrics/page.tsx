import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getMetrics } from "@/lib/metrics";

export const metadata: Metadata = {
  title: "Số liệu & mốc kích hoạt",
  robots: { index: false },
};

// Reflect live DB counts on every load.
export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  await requireAdmin();
  const { metrics, totals } = await getMetrics();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            Số liệu & mốc kích hoạt
          </h1>
          <p className="mt-1 text-sm text-muted">
            Điều kiện bật monetization (Phần B). Chưa đạt mốc thì chưa nên thu phí.
          </p>
        </div>
        <Link href="/admin" className="btn btn-secondary">
          Về kiểm duyệt
        </Link>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { l: "Tin đang hiển thị", v: totals.jobsPublished },
          { l: "Tổng hồ sơ freelancer", v: totals.profilesTotal },
          { l: "Tổng subscriber", v: totals.subscribersTotal },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl glass p-5">
            <dt className="text-sm text-muted">{s.l}</dt>
            <dd className="font-display mt-1 text-3xl font-bold text-fg">{s.v}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-6 space-y-3">
        {metrics.map((m) => {
          const reached = m.value >= m.target;
          const pct = Math.min(100, Math.round((m.value / m.target) * 100));
          return (
            <li key={m.key} className="rounded-2xl glass p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold ${
                        reached
                          ? "bg-success-weak text-success"
                          : "bg-surface-2 text-muted"
                      }`}
                    >
                      {reached ? (
                        <Check size={12} strokeWidth={2.5} aria-hidden />
                      ) : (
                        <Lock size={12} strokeWidth={2} aria-hidden />
                      )}
                      {reached ? "Đã đạt mốc" : "Chưa đạt"}
                    </span>
                    <span className="text-xs text-subtle">Mở: {m.unlocks}</span>
                  </div>
                  <h3 className="font-display mt-2 font-semibold text-fg">
                    {m.label}
                  </h3>
                  {m.note && <p className="mt-0.5 text-xs text-muted">{m.note}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-display text-2xl font-bold text-fg">
                    {m.value}
                    <span className="text-base font-normal text-subtle">
                      {" "}
                      / {m.target}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full ${reached ? "bg-success" : "bg-accent-solid"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-subtle">
        Traffic/tháng đo bằng Umami (self-host) — không tính được từ DB, xem
        dashboard Umami riêng.
      </p>
    </div>
  );
}
