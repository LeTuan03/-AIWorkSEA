import type { Job } from "@prisma/client";
import { COUNTRY_CODES, EMPLOYMENT_TYPES } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Build schema.org JobPosting structured data (Google Jobs rich results).
export function buildJobPostingJsonLd(job: Job): Record<string, unknown> {
  const isRemote = job.location === "Remote";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    employmentType: EMPLOYMENT_TYPES[job.engagement] ?? "CONTRACTOR",
    url: `${SITE_URL}/jobs/${job.id}`,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      ...(job.companyUrl ? { sameAs: job.companyUrl } : {}),
    },
  };

  if (isRemote) {
    jsonLd.jobLocationType = "TELECOMMUTE";
    jsonLd.applicantLocationRequirements = {
      "@type": "AdministrativeArea",
      name: "Southeast Asia",
    };
  } else {
    jsonLd.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: COUNTRY_CODES[job.location] ?? job.location,
      },
    };
  }

  // Only emit baseSalary when we can express a valid unit — our Part-time roles
  // store an hourly rate; project totals don't map cleanly to a unit.
  if (
    job.engagement === "Part-time" &&
    (job.budgetMin != null || job.budgetMax != null)
  ) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency,
      value: {
        "@type": "QuantitativeValue",
        ...(job.budgetMin != null ? { minValue: job.budgetMin } : {}),
        ...(job.budgetMax != null ? { maxValue: job.budgetMax } : {}),
        unitText: "HOUR",
      },
    };
  }

  return jsonLd;
}
