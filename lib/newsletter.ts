import { randomUUID } from "node:crypto";
import type { Job, Subscriber } from "@prisma/client";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function token(): string {
  return (randomUUID() + randomUUID()).replace(/-/g, "");
}

export type UpsertResult =
  | { status: "created" | "pending" | "resubscribed"; confirmToken: string }
  | { status: "already_confirmed" };

// Double opt-in entry point. Returns a fresh confirm token unless the address is
// already confirmed (in which case there's nothing to do).
export async function upsertPendingSubscriber(
  email: string,
  source: string,
): Promise<UpsertResult> {
  const existing = await prisma.subscriber.findUnique({ where: { email } });

  if (existing?.status === "CONFIRMED") {
    return { status: "already_confirmed" };
  }

  const confirmToken = token();

  if (!existing) {
    await prisma.subscriber.create({
      data: { email, source, status: "PENDING", confirmToken },
    });
    return { status: "created", confirmToken };
  }

  // PENDING or UNSUBSCRIBED → (re)issue a token and set back to PENDING.
  await prisma.subscriber.update({
    where: { email },
    data: { status: "PENDING", confirmToken, source },
  });
  return {
    status: existing.status === "UNSUBSCRIBED" ? "resubscribed" : "pending",
    confirmToken,
  };
}

export async function confirmSubscriber(
  confirmToken: string,
): Promise<Subscriber | null> {
  const sub = await prisma.subscriber.findUnique({ where: { confirmToken } });
  if (!sub) return null;
  return prisma.subscriber.update({
    where: { id: sub.id },
    data: { status: "CONFIRMED", confirmedAt: new Date(), confirmToken: null },
  });
}

export async function unsubscribeByToken(
  unsubToken: string,
): Promise<Subscriber | null> {
  const sub = await prisma.subscriber.findUnique({ where: { unsubToken } });
  if (!sub) return null;
  return prisma.subscriber.update({
    where: { id: sub.id },
    data: { status: "UNSUBSCRIBED" },
  });
}

export async function getConfirmedSubscribers(): Promise<
  Pick<Subscriber, "email" | "unsubToken">[]
> {
  return prisma.subscriber.findMany({
    where: { status: "CONFIRMED" },
    select: { email: true, unsubToken: true },
  });
}

// Published jobs from the last N days for the weekly digest.
export async function getRecentJobsForDigest(days = 7): Promise<Job[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return prisma.job.findMany({
    where: { status: "PUBLISHED", createdAt: { gte: since } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 30,
  });
}

export function confirmUrl(t: string): string {
  return `${SITE_URL}/newsletter/confirm?token=${t}`;
}

export function unsubscribeUrl(t: string): string {
  return `${SITE_URL}/newsletter/unsubscribe?token=${t}`;
}
