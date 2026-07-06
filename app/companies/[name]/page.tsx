import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getJobsByCompany } from "@/lib/jobs";
import { JobCard } from "@/components/JobCard";

type Params = { name: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { name } = await params;
  const company = decodeURIComponent(name);
  const jobs = await getJobsByCompany(company);
  if (jobs.length === 0) notFound();
  return {
    title: `${company} · việc làm AI & Automation`,
    description: `${jobs.length} việc làm AI/Automation đang tuyển tại ${company}.`,
    alternates: { canonical: `/companies/${name}` },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { name } = await params;
  const company = decodeURIComponent(name);
  const jobs = await getJobsByCompany(company);
  if (jobs.length === 0) notFound();

  const website = jobs.find((j) => j.companyUrl)?.companyUrl ?? null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/companies" className="transition-colors hover:text-accent">
          Nhà tuyển dụng
        </Link>
        <span aria-hidden className="text-subtle">/</span>
        <span className="text-fg">{company}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl glass p-6">
        <span className="font-display flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-weak text-2xl font-bold text-accent-weak-fg">
          {company.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            {company}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span>{jobs.length} việc đang tuyển</span>
            {website && (
              <>
                <span aria-hidden className="text-subtle">·</span>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  Website
                  <ExternalLink size={13} strokeWidth={1.75} aria-hidden />
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
