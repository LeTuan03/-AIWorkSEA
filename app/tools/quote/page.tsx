import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";
import "./quote.css";

export const metadata: Metadata = {
  title: "Tạo báo giá / proposal nhanh",
  description:
    "Công cụ miễn phí tạo báo giá và proposal chuyên nghiệp cho freelancer AI & Automation. Nhập hạng mục, tính tổng tự động, xuất PDF.",
  alternates: { canonical: "/tools/quote" },
};

export default function QuoteToolPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="quote-noprint">
        <h1 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Tạo báo giá nhanh
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Nhập hạng mục công việc, tự động tính tổng, rồi xuất PDF chuyên nghiệp để
          gửi khách. Miễn phí, không watermark, không cần đăng nhập — bản nháp được
          lưu ngay trên trình duyệt của bạn.
        </p>
      </div>

      <div className="mt-8">
        <QuoteBuilder />
      </div>
    </div>
  );
}
