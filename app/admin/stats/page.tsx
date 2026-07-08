import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  FilePlus2,
  Users,
  Mail,
  Calculator,
  Eye,
  MousePointerClick,
  UserPlus,
} from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getStats } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Số liệu vận hành",
  robots: { index: false },
};

// Live DB counts on every load (GĐ0 DoD: cập nhật hàng ngày).
export const dynamic = "force-dynamic";

export default async function StatsPage() {
  await requireAdmin();
  const s = await getStats();

  const core = [
    {
      Icon: Activity,
      label: "Traffic tháng này",
      value: s.trafficThisMonth,
      note: "Lượt xem trang (first-party, không cookie)",
    },
    {
      Icon: FilePlus2,
      label: "Tin đăng mới tháng này",
      value: s.newJobsThisMonth,
      note: "Mọi trạng thái, tính từ ngày 1",
    },
    {
      Icon: Users,
      label: "Tổng hồ sơ freelancer",
      value: s.profilesTotal,
      note: `+${s.profilesCreatedThisMonth} tạo mới tháng này`,
    },
    {
      Icon: Mail,
      label: "Tổng subscriber",
      value: s.subscribersTotal,
      note: `Đã xác nhận · +${s.signupsThisMonth} đăng ký tháng này`,
    },
    {
      Icon: Calculator,
      label: "Lượt dùng tool báo giá tháng này",
      value: s.quoteUsesThisMonth,
      note: "Mỗi lần xuất PDF tính 1 lượt",
    },
  ];

  const engagement = [
    { Icon: Eye, label: "Lượt xem chi tiết job", value: s.jobViewsThisMonth },
    {
      Icon: MousePointerClick,
      label: "Lượt bấm ứng tuyển",
      value: s.applyClicksThisMonth,
    },
    {
      Icon: UserPlus,
      label: "Hồ sơ tạo mới",
      value: s.profilesCreatedThisMonth,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            Số liệu vận hành
          </h1>
          <p className="mt-1 text-sm text-muted">
            5 chỉ số nền tảng (Giai đoạn 0). Số theo tháng tính từ ngày 1.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="btn btn-secondary">
            Kiểm duyệt
          </Link>
          <Link href="/admin/metrics" className="btn btn-secondary">
            Mốc kích hoạt
          </Link>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {core.map((m) => (
          <div key={m.label} className="rounded-2xl glass p-5">
            <dt className="flex items-center gap-2 text-sm text-muted">
              <m.Icon size={15} strokeWidth={1.75} aria-hidden />
              {m.label}
            </dt>
            <dd className="font-display mt-2 text-3xl font-bold text-fg">
              {m.value.toLocaleString("vi-VN")}
            </dd>
            <p className="mt-1 text-xs text-subtle">{m.note}</p>
          </div>
        ))}
      </dl>

      <h2 className="font-display mt-10 text-lg font-bold text-fg">
        Tương tác tháng này
      </h2>
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {engagement.map((m) => (
          <div key={m.label} className="rounded-2xl glass p-5">
            <dt className="flex items-center gap-2 text-sm text-muted">
              <m.Icon size={15} strokeWidth={1.75} aria-hidden />
              {m.label}
            </dt>
            <dd className="font-display mt-2 text-2xl font-bold text-fg">
              {m.value.toLocaleString("vi-VN")}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-xs text-subtle">
        Sự kiện được ghi first-party vào bảng Event (không cookie, không PII).
        Khu vực /admin không được tính vào traffic.
      </p>
    </div>
  );
}
