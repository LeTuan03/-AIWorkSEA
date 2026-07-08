import type { Job, FreelancerProfile } from "@prisma/client";
import { COUNTRY_CODES, EMPLOYMENT_TYPES } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://AIWORKSEA.netlify.app";

export const SITE_NAME = "AIWORK SEA";
export const SITE_DESCRIPTION =
  "Job board chuyên tuyển freelancer AI, Machine Learning và Automation ở Đông Nam Á.";

// schema.org WebSite + SearchAction — enables the Google sitelinks search box
// and tells crawlers how to run a site search (?q=...).
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "vi",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// schema.org Organization — brand entity for the knowledge panel / logo.
export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: SITE_DESCRIPTION,
  };
}

// schema.org BreadcrumbList from an ordered list of {name, url} crumbs.
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// schema.org ProfilePage + Person for a public freelancer profile.
export function buildProfileJsonLd(
  p: FreelancerProfile,
): Record<string, unknown> {
  const skills = p.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const person: Record<string, unknown> = {
    "@type": "Person",
    name: p.displayName,
    url: `${SITE_URL}/freelancer/${p.username}`,
    ...(p.headline ? { description: p.headline } : {}),
    ...(p.avatarUrl ? { image: p.avatarUrl } : {}),
    ...(p.portfolioUrl ? { sameAs: [p.portfolioUrl] } : {}),
    ...(skills.length ? { knowsAbout: skills } : {}),
  };

  return {
    "@context": "https://schema.org/",
    "@type": "ProfilePage",
    dateModified: p.updatedAt.toISOString(),
    mainEntity: person,
  };
}

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
    // Stable identifier helps Google de-duplicate the posting across crawls.
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      ...(job.companyUrl ? { sameAs: job.companyUrl } : {}),
    },
    // Google drops JobPosting rich results once validThrough passes; only emit
    // it when we actually have an expiry so live jobs aren't marked expired.
    ...(job.expiresAt ? { validThrough: job.expiresAt.toISOString() } : {}),
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
