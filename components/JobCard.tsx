import Link from "next/link";
import { Star } from "lucide-react";
import type { Job } from "@prisma/client";
import { formatBudget, parseSkills, timeAgo } from "@/lib/jobs";
import { LOCATION_LABELS } from "@/lib/constants";
import { CategoryIcon } from "@/components/CategoryIcon";

export function JobCard({ job }: { job: Job }) {
  const skills = parseSkills(job.skills).slice(0, 5);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={`lift group relative block overflow-hidden rounded-2xl glass p-6 ${
        job.featured ? "border-accent" : ""
      }`}
    >
      {job.featured && (
        <span className="chip chip-accent absolute right-3 top-3">
          <Star size={12} strokeWidth={2} className="fill-current" aria-hidden />
          Nổi bật
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <span className="chip chip-accent">
          <CategoryIcon category={job.category} size={14} />
          {job.category}
        </span>
        {!job.featured && (
          <span className="whitespace-nowrap pt-1 text-xs text-subtle">
            {timeAgo(job.createdAt)}
          </span>
        )}
      </div>

      <h3 className="font-display mt-3 text-base font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
        {job.title}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {job.company} · {LOCATION_LABELS[job.location] ?? job.location}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span key={skill} className="chip">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="chip">{job.workType}</span>
          <span className="chip">{job.engagement}</span>
        </div>
        <span className="font-display text-sm font-bold text-fg">
          {formatBudget(job)}
        </span>
      </div>
    </Link>
  );
}
