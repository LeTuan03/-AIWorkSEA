import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getProfileByUserId } from "@/lib/profiles";
import { ProfileForm } from "@/components/ProfileForm";
import type { ProfileFormValues } from "@/lib/profile-validation";

export const metadata: Metadata = {
  title: "Hồ sơ freelancer của bạn",
  robots: { index: false },
};

export default async function EditProfilePage() {
  const user = await requireUser();
  const profile = await getProfileByUserId(user.id);

  const initial: ProfileFormValues | undefined = profile
    ? {
        username: profile.username,
        displayName: profile.displayName,
        headline: profile.headline ?? "",
        bio: profile.bio,
        skills: profile.skills,
        portfolioUrl: profile.portfolioUrl ?? "",
        avatarUrl: profile.avatarUrl ?? "",
        rateReference: profile.rateReference ?? "",
        contactEmail: profile.contactEmail ?? "",
        contactPhone: profile.contactPhone ?? "",
        availability: profile.availability,
        visibility: profile.visibility,
      }
    : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            {profile ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ freelancer"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Hồ sơ công khai giúp nhà tuyển dụng chủ động tìm thấy bạn. Miễn phí.
          </p>
        </div>
        {profile && (
          <Link
            href={`/freelancer/${profile.username}`}
            className="shrink-0 text-sm font-medium text-accent hover:underline"
          >
            Xem trang
          </Link>
        )}
      </div>

      <Link
        href="/freelancers"
        className="mt-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-accent"
      >
        <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
        Danh sách freelancer
      </Link>

      <div className="mt-6">
        <ProfileForm initial={initial} />
      </div>
    </div>
  );
}
