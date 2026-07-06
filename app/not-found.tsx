import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="font-display text-6xl font-extrabold tracking-tight text-accent">404</span>
      <h1 className="font-display mt-4 text-2xl font-bold text-fg">
        Không tìm thấy trang
      </h1>
      <p className="mt-2 text-muted">
        Việc làm bạn tìm có thể đã bị gỡ hoặc không tồn tại.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Về trang chủ
      </Link>
    </div>
  );
}
