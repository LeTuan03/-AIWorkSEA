import type { Metadata } from "next";
import Link from "next/link";
import { getMarketInsights } from "@/lib/insights";
import { LOCATION_LABELS } from "@/lib/constants";
import { buildBreadcrumbJsonLd, SITE_URL, SITE_NAME } from "@/lib/seo";
import { ShareButtons } from "@/components/ShareButtons";

const PATH = "/insights/thi-truong-freelancer-ai-dong-nam-a";

export const metadata: Metadata = {
  title: "Thị trường tuyển dụng freelancer AI & Automation Đông Nam Á",
  description:
    "Báo cáo dữ liệu từ tin đăng thật trên AIWORK SEA: lĩnh vực nào đang tuyển nhiều nhất, kỹ năng được yêu cầu, tỷ lệ việc remote và mặt bằng ngân sách dự án.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Thị trường tuyển dụng freelancer AI & Automation Đông Nam Á",
    description:
      "Số liệu trực tiếp từ tin đăng trên AIWORK SEA: lĩnh vực, kỹ năng, tỷ lệ remote và ngân sách.",
    type: "article",
    url: PATH,
  },
};

// Numbers are aggregated from the live database on every request.
export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const d = await getMarketInsights();
  const topCategory = d.categories[0];
  const topSkillNames = d.topSkills.slice(0, 5).map((s) => s.name);

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Trang chủ", url: "/" },
      { name: "Báo cáo thị trường", url: PATH },
    ]),
    {
      "@context": "https://schema.org/",
      "@type": "Article",
      headline:
        "Thị trường tuyển dụng freelancer AI & Automation Đông Nam Á",
      description:
        "Báo cáo dữ liệu từ tin đăng thật trên AIWORK SEA: lĩnh vực, kỹ năng, tỷ lệ remote và ngân sách.",
      url: `${SITE_URL}${PATH}`,
      dateModified: new Date().toISOString(),
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-sm text-muted">Báo cáo dữ liệu · cập nhật tự động</p>
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        Thị trường tuyển dụng freelancer AI &amp; Automation Đông Nam Á
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        Số liệu dưới đây được tổng hợp trực tiếp từ {d.totalJobs} tin đang tuyển
        của {d.totalCompanies} nhà tuyển dụng trên AIWORK SEA — không ước lượng,
        không khảo sát. Trang này tự cập nhật khi có tin mới, nên con số bạn
        đang đọc luôn là hiện trạng mới nhất của thị trường.
      </p>

      {/* Headline numbers */}
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { l: "Tin đang tuyển", v: String(d.totalJobs) },
          { l: "Nhà tuyển dụng", v: String(d.totalCompanies) },
          { l: "Việc remote", v: `${d.remoteShare}%` },
          { l: "Hồ sơ freelancer", v: String(d.totalProfiles) },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl glass p-4">
            <dd className="font-display text-2xl font-bold text-fg">{s.v}</dd>
            <dt className="mt-0.5 text-xs text-muted">{s.l}</dt>
          </div>
        ))}
      </dl>

      <h2 className="font-display mt-12 text-xl font-bold tracking-tight text-fg">
        Lĩnh vực nào đang tuyển nhiều nhất?
      </h2>
      {topCategory ? (
        <p className="mt-3 leading-relaxed text-muted">
          {topCategory.name} dẫn đầu với {topCategory.share}% tổng số tin. Phân
          bố đầy đủ theo lĩnh vực:
        </p>
      ) : (
        <p className="mt-3 text-muted">Chưa đủ dữ liệu để phân tích.</p>
      )}
      <ul className="mt-4 space-y-2">
        {d.categories.map((c) => (
          <li key={c.name} className="flex items-center gap-3">
            <span className="w-56 shrink-0 truncate text-sm text-fg">
              {c.name}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
              <span
                className="block h-full rounded-full bg-accent-solid"
                style={{ width: `${Math.max(4, c.share)}%` }}
              />
            </span>
            <span className="w-16 shrink-0 text-right text-sm text-muted">
              {c.count} tin
            </span>
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-12 text-xl font-bold tracking-tight text-fg">
        Kỹ năng được yêu cầu nhiều nhất
      </h2>
      {topSkillNames.length > 0 && (
        <p className="mt-3 leading-relaxed text-muted">
          {topSkillNames.join(", ")} là những kỹ năng xuất hiện thường xuyên
          nhất trong yêu cầu tuyển dụng. Nếu bạn đang chọn hướng học tiếp, đây
          là tín hiệu trực tiếp từ người trả tiền.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {d.topSkills.map((s) => (
          <span key={s.name} className="chip">
            {s.name}
            <span className="text-subtle">· {s.count}</span>
          </span>
        ))}
      </div>

      <h2 className="font-display mt-12 text-xl font-bold tracking-tight text-fg">
        Việc đến từ đâu, làm theo hình thức nào?
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        {d.remoteShare}% tin cho phép làm việc từ xa hoàn toàn — freelancer ở
        bất kỳ đâu trong khu vực đều ứng tuyển được. Nguồn tin theo địa điểm
        đăng ký của nhà tuyển dụng:
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {d.locations.map((l) => (
          <li
            key={l.name}
            className="flex items-center justify-between rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm"
          >
            <span className="text-fg">{LOCATION_LABELS[l.name] ?? l.name}</span>
            <span className="text-muted">{l.count}</span>
          </li>
        ))}
      </ul>

      {d.usdBudget && (
        <>
          <h2 className="font-display mt-12 text-xl font-bold tracking-tight text-fg">
            Mặt bằng ngân sách dự án
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Trên {d.usdBudget.sampled} tin niêm yết ngân sách bằng USD (không
            tính việc trả theo giờ), mức trung vị là{" "}
            {d.usdBudget.median.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            /dự án, trải từ{" "}
            {d.usdBudget.min.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}{" "}
            đến{" "}
            {d.usdBudget.max.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            . Con số này phản ánh dự án đăng công khai — hợp đồng thương lượng
            riêng thường cao hơn.
          </p>
        </>
      )}

      <h2 className="font-display mt-12 text-xl font-bold tracking-tight text-fg">
        Dùng dữ liệu này thế nào?
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Freelancer: đối chiếu kỹ năng của bạn với danh sách trên, rồi{" "}
        <Link href="/freelancer/edit" className="font-medium text-accent hover:underline">
          tạo hồ sơ miễn phí
        </Link>{" "}
        để nhà tuyển dụng chủ động tìm thấy. Nhà tuyển dụng: xem mặt bằng ngân
        sách trước khi{" "}
        <Link href="/post" className="font-medium text-accent hover:underline">
          đăng tin
        </Link>{" "}
        để nhận được ứng viên phù hợp nhanh hơn. Trích dẫn số liệu tự do, vui
        lòng dẫn nguồn AIWORK SEA kèm liên kết về trang này.
      </p>

      <hr className="my-8 border-line" />
      <ShareButtons title="Thị trường tuyển dụng freelancer AI & Automation Đông Nam Á" />
    </article>
  );
}
