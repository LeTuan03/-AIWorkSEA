import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-2xl glass p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
          Đăng nhập
        </h1>
        <p className="mt-1 text-sm text-muted">
          Đăng nhập để đăng tin và quản lý tuyển dụng.
        </p>

        <div className="mt-6">
          <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-medium text-accent hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
