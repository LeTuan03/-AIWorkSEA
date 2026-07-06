import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/PostForm";

export const metadata: Metadata = {
  title: "Đăng tin tuyển freelancer AI/Automation",
  description:
    "Đăng tin tuyển freelancer AI, Machine Learning và Automation ở Đông Nam Á. Đăng tin cơ bản miễn phí.",
};

export default function PostJobPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
        Quay lại
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          Đăng tin tuyển dụng
        </h1>
        <p className="mt-2 text-muted">
          Tiếp cận freelancer AI &amp; Automation ở Đông Nam Á. Tin cơ bản miễn
          phí, bạn tự nhận hồ sơ trực tiếp qua link hoặc email.
        </p>
      </div>

      <div className="mt-8 rounded-2xl glass p-6 sm:p-8">
        <PostForm />
      </div>
    </div>
  );
}
