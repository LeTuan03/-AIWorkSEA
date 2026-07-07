import type { ApplicationCard } from "@prisma/client";
import { prisma } from "@/lib/db";

// Card shape sent to the client board (no user/job internals leaked).
export type TrackerCard = {
  id: string;
  title: string;
  company: string | null;
  link: string | null;
  notes: string | null;
  column: string;
  order: number;
};

function toCard(c: ApplicationCard): TrackerCard {
  return {
    id: c.id,
    title: c.title,
    company: c.company,
    link: c.link,
    notes: c.notes,
    column: c.column,
    order: c.order,
  };
}

export async function getCardsByUser(userId: string): Promise<TrackerCard[]> {
  const cards = await prisma.applicationCard.findMany({
    where: { userId },
    orderBy: [{ column: "asc" }, { order: "asc" }],
  });
  return cards.map(toCard);
}

// Does the user already track this job? (Avoids duplicate cards from the
// "track this application" button on a job page.)
export async function hasCardForJob(
  userId: string,
  jobId: string,
): Promise<boolean> {
  const existing = await prisma.applicationCard.findFirst({
    where: { userId, jobId },
    select: { id: true },
  });
  return existing != null;
}

export type CreateCardInput = {
  title: string;
  company?: string | null;
  link?: string | null;
  notes?: string | null;
  jobId?: string | null;
};

// New cards land at the bottom of the "SENT" column.
export async function createCard(
  userId: string,
  input: CreateCardInput,
): Promise<TrackerCard> {
  const count = await prisma.applicationCard.count({
    where: { userId, column: "SENT" },
  });
  const card = await prisma.applicationCard.create({
    data: {
      userId,
      title: input.title,
      company: input.company ?? null,
      link: input.link ?? null,
      notes: input.notes ?? null,
      jobId: input.jobId ?? null,
      column: "SENT",
      order: count,
    },
  });
  return toCard(card);
}

export async function deleteCard(userId: string, cardId: string): Promise<void> {
  // deleteMany scoped by userId so a card can only be deleted by its owner.
  await prisma.applicationCard.deleteMany({ where: { id: cardId, userId } });
}

// Persist a drag: `orderedIds` is the full new order of the destination column.
// Every id is verified to belong to the user before anything is written.
export async function moveCard(
  userId: string,
  toColumn: string,
  orderedIds: string[],
): Promise<boolean> {
  if (orderedIds.length === 0) return true;

  const owned = await prisma.applicationCard.findMany({
    where: { id: { in: orderedIds }, userId },
    select: { id: true },
  });
  if (owned.length !== orderedIds.length) return false; // some id isn't theirs

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.applicationCard.update({
        where: { id },
        data: { column: toColumn, order: index },
      }),
    ),
  );
  return true;
}
