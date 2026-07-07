import { Prisma, type FreelancerProfile } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ValidatedProfile } from "@/lib/profile-validation";

export const PROFILE_PAGE_SIZE = 12;

export type ProfileListResult = {
  profiles: FreelancerProfile[];
  total: number;
  page: number;
  totalPages: number;
};

// Public directory: only PUBLIC profiles that aren't self-hidden. Skill filter
// and pagination happen in Postgres so this scales.
export async function listProfiles(opts: {
  skill?: string;
  page?: number;
} = {}): Promise<ProfileListResult> {
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const and: Prisma.FreelancerProfileWhereInput[] = [
    { visibility: "PUBLIC" },
    { availability: { not: "HIDDEN" } },
  ];

  const skill = opts.skill?.trim();
  if (skill) {
    and.push({
      OR: [
        { skills: { contains: skill, mode: "insensitive" } },
        { displayName: { contains: skill, mode: "insensitive" } },
        { headline: { contains: skill, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.FreelancerProfileWhereInput = { AND: and };

  const [profiles, total] = await Promise.all([
    prisma.freelancerProfile.findMany({
      where,
      // Featured first, then most recently updated. Availability shows as a badge.
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * PROFILE_PAGE_SIZE,
      take: PROFILE_PAGE_SIZE,
    }),
    prisma.freelancerProfile.count({ where }),
  ]);

  return {
    profiles,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PROFILE_PAGE_SIZE)),
  };
}

export async function getProfileByUsername(
  username: string,
): Promise<FreelancerProfile | null> {
  return prisma.freelancerProfile.findUnique({ where: { username } });
}

export async function getProfileByUserId(
  userId: string,
): Promise<FreelancerProfile | null> {
  return prisma.freelancerProfile.findUnique({ where: { userId } });
}

// Is this username taken by *someone else*? (Allows a user to keep their own.)
export async function isUsernameTaken(
  username: string,
  exceptUserId: string,
): Promise<boolean> {
  const existing = await prisma.freelancerProfile.findUnique({
    where: { username },
    select: { userId: true },
  });
  return existing != null && existing.userId !== exceptUserId;
}

// Create or update the caller's single profile.
export async function upsertProfile(
  userId: string,
  data: ValidatedProfile,
): Promise<FreelancerProfile> {
  return prisma.freelancerProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}

// Public usernames for the sitemap (excludes UNLISTED / HIDDEN).
export async function getPublicProfiles(): Promise<
  Pick<FreelancerProfile, "username" | "updatedAt">[]
> {
  return prisma.freelancerProfile.findMany({
    where: { visibility: "PUBLIC", availability: { not: "HIDDEN" } },
    select: { username: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });
}
