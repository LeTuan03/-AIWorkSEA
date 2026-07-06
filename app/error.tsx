"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd report to an error tracker.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-weak text-danger">
        <TriangleAlert size={26} strokeWidth={1.75} aria-hidden />
      </span>
      <h1 className="font-display mt-4 text-2xl font-bold text-fg">
        Đã xảy ra lỗi
      </h1>
      <p className="mt-2 text-muted">
        Có sự cố khi tải nội dung. Vui lòng thử lại sau giây lát.
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="btn btn-primary">
          Thử lại
        </button>
        <Link href="/" className="btn btn-secondary">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
