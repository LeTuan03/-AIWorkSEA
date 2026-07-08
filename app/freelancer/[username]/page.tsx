import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mail,
  Phone,
  ExternalLink,
  Pencil,
  CircleUser,
  BadgeCheck,
} from "lucide-react";
import { getProfileByUsername } from "@/lib/profiles";
import { getCurrentUser } from "@/lib/session";
import { parseSkills } from "@/lib/jobs";
import { AVAILABILITY_LABELS } from "@/lib/constants";
import { buildProfileJsonLd, SITE_URL } from "@/lib/seo";
import { ShareButtons } from "@/components/ShareButtons";

type Params = { params: Promise<{ username: string }> };

// "Tạm ẩn hồ sơ" (availability HIDDEN) means invisible to everyone except the
// owner (preview) and admins. UNLISTED stays reachable by direct link, noindex.
async function canView(profile: {
  availability: string;
  userId: string;
}): Promise<boolean> {
  if (profile.availability !== "HIDDEN") return true;
  const me = await getCurrentUser();
  return me?.id === profile.userId || me?.role === "ADMIN";
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile || !(await canView(profile))) {
    return { title: "Không tìm thấy hồ sơ", robots: { index: false } };
  }

  const hidden =
    profile.visibility === "UNLISTED" || profile.availability === "HIDDEN";
  const desc =
    profile.headline ?? `${profile.displayName} — ${profile.skills}`.slice(0, 155);

  return {
    title: `${profile.displayName}${profile.headline ? ` · ${profile.headline}` : ""}`,
    description: desc,
    alternates: { canonical: `/freelancer/${profile.username}` },
    robots: hidden ? { index: false } : undefined,
    openGraph: {
      title: profile.displayName,
      description: desc,
      type: "profile",
      url: `${SITE_URL}/freelancer/${profile.username}`,
      ...(profile.avatarUrl ? { images: [profile.avatarUrl] } : {}),
    },
  };
}

const availabilityStyles: Record<string, string> = {
  OPEN: "bg-success-weak text-success",
  BUSY: "bg-warn-weak text-warn",
  HIDDEN: "bg-surface-2 text-muted",
};

export default async function FreelancerProfilePage({ params }: Params) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile || !(await canView(profile))) notFound();

  const [me, skills] = [await getCurrentUser(), parseSkills(profile.skills)];
  const isOwner = me?.id === profile.userId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProfileJsonLd(profile)),
        }}
      />

      <Link
        href="/freelancers"
        className="text-sm text-muted transition hover:text-accent"
      >
        ← Danh sách freelancer
      </Link>

      <div className="mt-4 rounded-2xl glass p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          {profile.avatarUrl ? (
            // Arbitrary user-provided host; skip the Next image optimizer.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              width={88}
              height={88}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-22 w-22 shrink-0 rounded-2xl border border-line object-cover"
              style={{ height: 88, width: 88 }}
            />
          ) : (
            <span className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-2xl bg-accent-weak text-accent-weak-fg">
              <CircleUser size={44} strokeWidth={1.5} aria-hidden />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${
                  availabilityStyles[profile.availability] ?? "bg-surface-2 text-muted"
                }`}
              >
                {AVAILABILITY_LABELS[profile.availability] ?? profile.availability}
              </span>
              {profile.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-success-weak px-2 py-0.5 text-xs font-semibold text-success">
                  <BadgeCheck size={12} strokeWidth={2} aria-hidden />
                  Đã xác thực
                </span>
              )}
              {isOwner && (
                <Link
                  href="/freelancer/edit"
                  className="inline-flex items-center gap-1 rounded-lg border border-line-strong px-2 py-0.5 text-xs font-medium text-fg transition hover:bg-surface-2"
                >
                  <Pencil size={12} strokeWidth={1.75} aria-hidden />
                  Sửa
                </Link>
              )}
            </div>
            <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-fg">
              {profile.displayName}
            </h1>
            {profile.headline && (
              <p className="mt-1 text-muted">{profile.headline}</p>
            )}
            {profile.rateReference && (
              <p className="mt-2 text-sm font-semibold text-fg">
                Mức giá: {profile.rateReference}
              </p>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-fg">
          {profile.bio}
        </div>

        {/* Contact — public by design (Part A.1) */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
          {profile.contactEmail && (
            <a href={`mailto:${profile.contactEmail}`} className="btn btn-primary">
              <Mail size={16} strokeWidth={1.75} aria-hidden />
              Liên hệ qua email
            </a>
          )}
          {profile.portfolioUrl && (
            <a
              href={profile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn btn-secondary"
            >
              <ExternalLink size={16} strokeWidth={1.75} aria-hidden />
              Xem portfolio
            </a>
          )}
          {profile.contactPhone && (
            <span className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-3 py-2 text-sm font-medium text-fg">
              <Phone size={16} strokeWidth={1.75} aria-hidden />
              {profile.contactPhone}
            </span>
          )}
        </div>

        <div className="mt-6 border-t border-line pt-6">
          <ShareButtons
            title={`${profile.displayName} — freelancer AI & Automation trên AIWORK SEA`}
          />
        </div>
      </div>
    </div>
  );
}
