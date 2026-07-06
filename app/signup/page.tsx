import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/SignupForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Đăng ký nhà tuyển dụng",
  robots: { index: false },
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-2xl glass p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
          Tạo tài khoản
        </h1>
        <p className="mt-1 text-sm text-muted">
          Dành cho nhà tuyển dụng muốn đăng tin AI/Automation.
        </p>

        <div className="mt-6">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
