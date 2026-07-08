import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_PAGES } from "@/lib/landing";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Việc làm AI & Automation theo danh mục",
  description:
    "Duyệt việc làm freelancer AI & Automation ở Đông Nam Á theo kỹ năng, hình thức làm việc và quốc gia: prompt engineering, automation, remote, Việt Nam, Singapore.",
  alternates: { canonical: "/viec-lam" },
};

const GROUPS = [
  { key: "skill", label: "Theo kỹ năng" },
  { key: "worktype", label: "Theo hình thức" },
  { key: "location", label: "Theo quốc gia" },
] as const;

export default function LandingIndexPage() {
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Trang chủ", url: "/" },
    { name: "Việc làm theo danh mục", url: "/viec-lam" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        Việc làm AI &amp; Automation theo danh mục
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Chọn đúng ngách của bạn: mỗi danh mục là một trang riêng, cập nhật theo
        tin đăng thật trên AIWork SEA.
      </p>

      {GROUPS.map((group) => {
        const pages = LANDING_PAGES.filter((p) => p.group === group.key);
        return (
          <section key={group.key} className="mt-10">
            <h2 className="font-display text-lg font-bold tracking-tight text-fg">
              {group.label}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/viec-lam/${p.slug}`}
                    className="lift group flex h-full items-center justify-between gap-3 rounded-2xl glass p-4"
                  >
                    <span className="text-sm font-semibold text-fg">
                      {p.title}
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden
                      className="shrink-0 text-subtle transition group-hover:text-accent"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
