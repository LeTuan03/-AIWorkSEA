import Link from "next/link";
import type { Metadata } from "next";
import { getCompanies } from "@/lib/jobs";

// Live company data; render per-request so the build doesn't depend on the
// database being reachable during the export step.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nhà tuyển dụng",
  description:
    "Các công ty đang tuyển freelancer AI & Automation ở Đông Nam Á trên AIWork SEA.",
  alternates: { canonical: "/companies" },
};

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
        Nhà tuyển dụng
      </h1>
      <p className="mt-2 text-muted">
        {companies.length} công ty đang tuyển freelancer AI &amp; Automation.
      </p>

      {companies.length === 0 ? (
        <p className="mt-8 rounded-2xl glass border-dashed border-line-strong p-12 text-center text-muted">
          Chưa có công ty nào.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {companies.map((c) => (
            <Link
              key={c.company}
              href={`/companies/${encodeURIComponent(c.company)}`}
              className="lift flex items-center gap-4 rounded-2xl glass p-4"
            >
              <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-weak text-lg font-bold text-accent-weak-fg">
                {initial(c.company)}
              </span>
              <span className="min-w-0">
                <span className="font-display block truncate font-semibold text-fg">
                  {c.company}
                </span>
                <span className="text-sm text-muted">
                  {c.jobCount} việc đang tuyển
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
