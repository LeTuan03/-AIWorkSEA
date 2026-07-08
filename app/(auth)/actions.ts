"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// bcrypt only hashes the first 72 bytes; longer input is silently truncated.
const PASSWORD_MAX = 72;

export type AuthState = {
  error?: string;
  values?: { email?: string; name?: string };
};

// Only allow internal relative paths as post-login redirect targets.
function safeCallback(url: string | null | undefined): string {
  if (url && url.startsWith("/") && !url.startsWith("//")) return url;
  return "/dashboard";
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { error: "Đăng nhập thất bại." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallback(String(formData.get("callbackUrl") ?? ""));

  if (!email || !password) {
    return { error: "Vui lòng nhập email và mật khẩu.", values: { email } };
  }
  if (password.length > PASSWORD_MAX) {
    return { error: "Email hoặc mật khẩu không đúng.", values: { email } };
  }

  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 10, 60_000)) {
    return { error: "Quá nhiều lần thử. Vui lòng đợi một phút.", values: { email } };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email hoặc mật khẩu không đúng.", values: { email } };
    }
    throw error; // NEXT_REDIRECT on success
  }
  return {};
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (String(formData.get("company_website") ?? "").trim()) {
    return { error: "Đăng ký thất bại." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const values = { email, name };

  if (!email || !password) {
    return { error: "Vui lòng nhập email và mật khẩu.", values };
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { error: "Email không hợp lệ.", values };
  }
  if (name.length > 100) {
    return { error: "Tên quá dài (tối đa 100 ký tự).", values };
  }
  if (password.length < 8) {
    return { error: "Mật khẩu tối thiểu 8 ký tự.", values };
  }
  if (password.length > PASSWORD_MAX) {
    return { error: `Mật khẩu tối đa ${PASSWORD_MAX} ký tự.`, values };
  }

  const ip = await clientIp();
  if (!rateLimit(`signup:${ip}`, 5, 60 * 60_000)) {
    return { error: "Quá nhiều tài khoản tạo từ IP này. Thử lại sau.", values };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email đã được đăng ký.", values };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: { email, name: name || null, passwordHash, role: "USER" },
    });
  } catch (error) {
    // Two concurrent signups can pass the findUnique check; the unique
    // constraint is the source of truth.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "Email đã được đăng ký.", values };
    }
    throw error;
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      // Account created but auto sign-in failed; send them to log in manually.
      redirect("/login");
    }
    throw error; // NEXT_REDIRECT on success
  }
  return {};
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
