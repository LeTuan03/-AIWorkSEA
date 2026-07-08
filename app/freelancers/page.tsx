import type { Metadata } from "next";
import Link from "next/link";
import { Search, CircleUser, UserPlus, BadgeCheck } from "lucide-react";
import { listProfiles } from "@/lib/profiles";
import { parseSkills } from "@/lib/jobs";
import { AVAILABILITY_LABELS } from "@/lib/constants";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Freelancer AI & Automation ở Đông Nam Á",
  description:
    "Danh sách freelancer AI, Machine Learning và Automation ở Đông Nam Á. Xem hồ sơ, kỹ năng, mức giá và liên hệ trực tiếp.",
  alternates: { canonical: "/freelancers" },
};

type SearchParams = { skill?: string; page?: string };

const availabilityStyles: Record<string, string> = {
  OPEN: "bg-success-weak text-success",
  BUSY: "bg-warn-weak text-warn",
};

export default async function FreelancersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const pageNum = Number.parseInt(params.page ?? "1", 10);
  const { profiles, total, page, totalPages } = await listProfiles({
    skill: params.skill,
    page: Number.isNaN(pageNum) ? 1 : pageNum,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Freelancer AI &amp; Automation
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Nhà tuyển dụng có thể chủ động tìm và liên hệ trực tiếp. Freelancer tạo
            hồ sơ miễn phí để được tìm thấy.
          </p>
        </div>
        <Link href="/freelancer/edit" className="btn btn-primary">
          <UserPlus size={16} strokeWidth={2} aria-hidden />
          Tạo hồ sơ của bạn
        </Link>
      </div>

      {/* Skill filter */}
      <form method="GET" action="/freelancers" className="mt-8 flex max-w-xl gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            name="skill"
            type="text"
            defaultValue={params.skill ?? ""}
            aria-label="Lọc theo kỹ năng"
            placeholder="Kỹ năng (RAG, n8n, Computer Vision…)"
            className="field pl-11"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Lọc
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">
          {params.skill ? "Kết quả" : "Tất cả freelancer"}
          <span className="ml-2 text-sm font-normal text-muted">({total})</span>
        </h2>
        {params.skill && (
          <Link href="/freelancers" className="text-sm font-medium text-accent hover:underline">
            Xóa lọc
          </Link>
        )}
      </div>

      {profiles.length === 0 ? (
        <div className="mt-8 rounded-2xl glass border-dashed border-line-strong p-12 text-center">
          <p className="text-muted">
            Chưa có freelancer nào{params.skill ? " khớp bộ lọc" : ""}.
          </p>
          <Link
            href="/freelancer/edit"
            className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
          >
            Trở thành người đầu tiên
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p) => {
              const skills = parseSkills(p.skills).slice(0, 5);
              return (
                <li key={p.id}>
                  <Link
                    href={`/freelancer/${p.username}`}
                    className="lift block h-full rounded-2xl glass p-5"
                  >
                    <div className="flex items-start gap-3">
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatarUrl}
                          alt={p.displayName}
                          width={48}
                          height={48}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 shrink-0 rounded-xl border border-line object-cover"
                          style={{ height: 48, width: 48 }}
                        />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
                          <CircleUser size={26} strokeWidth={1.5} aria-hidden />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display truncate font-semibold text-fg">
                            {p.displayName}
                          </span>
                          {p.isVerified && (
                            <BadgeCheck
                              size={16}
                              strokeWidth={2}
                              aria-label="Đã xác thực"
                              className="shrink-0 text-success"
                            />
                          )}
                        </div>
                        {p.headline && (
                          <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                            {p.headline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {availabilityStyles[p.availability] && (
                        <span
                          className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${availabilityStyles[p.availability]}`}
                        >
                          {AVAILABILITY_LABELS[p.availability]}
                        </span>
                      )}
                      {p.rateReference && (
                        <span className="text-xs text-subtle">{p.rateReference}</span>
                      )}
                    </div>

                    {skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <span key={s} className="chip">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/freelancers"
            query={{ skill: params.skill }}
          />
        </>
      )}
    </div>
  );
}
