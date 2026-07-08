import { prisma } from "@/lib/db";

// First-party analytics (Giai đoạn 0). Events land in the Event table — no
// cookies, no PII, no external service. /admin/stats reads the aggregates.
// If Plausible/Umami is added later, this stays as the source /admin/stats uses.

export const EVENT_NAMES = [
  "pageview",
  "job_view",
  "job_apply_click",
  "profile_created",
  "newsletter_signup",
  "quote_tool_used",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export function isValidEventName(v: string): v is EventName {
  return (EVENT_NAMES as readonly string[]).includes(v);
}

// Fire-and-forget write. Never throws — analytics must not break the feature
// it instruments (used inside server actions).
export async function recordEvent(
  name: EventName,
  opts: { path?: string; refId?: string } = {},
): Promise<void> {
  try {
    await prisma.event.create({
      data: {
        name,
        path: opts.path?.slice(0, 300) ?? null,
        refId: opts.refId?.slice(0, 100) ?? null,
      },
    });
  } catch (err) {
    console.error("[analytics] recordEvent failed", err);
  }
}

export type StatsSnapshot = {
  // The 5 numbers Giai đoạn 0 requires on /admin/stats.
  trafficThisMonth: number; // pageview events since the 1st
  newJobsThisMonth: number; // jobs created since the 1st (any status)
  profilesTotal: number;
  subscribersTotal: number; // confirmed
  quoteUsesThisMonth: number; // quote_tool_used events since the 1st
  // Supporting engagement numbers (same table, nearly free to compute).
  jobViewsThisMonth: number;
  applyClicksThisMonth: number;
  signupsThisMonth: number; // newsletter_signup events
  profilesCreatedThisMonth: number;
};

export async function getStats(): Promise<StatsSnapshot> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const countEvent = (name: EventName) =>
    prisma.event.count({ where: { name, createdAt: { gte: monthStart } } });

  const [
    trafficThisMonth,
    newJobsThisMonth,
    profilesTotal,
    subscribersTotal,
    quoteUsesThisMonth,
    jobViewsThisMonth,
    applyClicksThisMonth,
    signupsThisMonth,
    profilesCreatedThisMonth,
  ] = await Promise.all([
    countEvent("pageview"),
    prisma.job.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.freelancerProfile.count(),
    prisma.subscriber.count({ where: { status: "CONFIRMED" } }),
    countEvent("quote_tool_used"),
    countEvent("job_view"),
    countEvent("job_apply_click"),
    countEvent("newsletter_signup"),
    countEvent("profile_created"),
  ]);

  return {
    trafficThisMonth,
    newJobsThisMonth,
    profilesTotal,
    subscribersTotal,
    quoteUsesThisMonth,
    jobViewsThisMonth,
    applyClicksThisMonth,
    signupsThisMonth,
    profilesCreatedThisMonth,
  };
}
