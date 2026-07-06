import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getJob } from "@/lib/jobs";
import { EditForm } from "@/components/EditForm";
import type { JobFormValues } from "@/lib/job-validation";

export const metadata: Metadata = {
  title: "Sửa tin",
  robots: { index: false },
};

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const job = await getJob(id);

  // Ownership check — only the poster may edit.
  if (!job || job.userId !== user.id) notFound();

  const initial: JobFormValues = {
    title: job.title,
    company: job.company,
    companyUrl: job.companyUrl ?? "",
    category: job.category,
    location: job.location,
    workType: job.workType,
    engagement: job.engagement,
    budgetMin: job.budgetMin?.toString() ?? "",
    budgetMax: job.budgetMax?.toString() ?? "",
    currency: job.currency,
    description: job.description,
    skills: job.skills,
    applyUrl: job.applyUrl ?? "",
    applyEmail: job.applyEmail ?? "",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
        Quay lại bảng điều khiển
      </Link>

      <h1 className="font-display mt-4 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        Sửa tin tuyển dụng
      </h1>

      <div className="mt-8 rounded-2xl glass p-6 sm:p-8">
        <EditForm jobId={job.id} initial={initial} />
      </div>
    </div>
  );
}
