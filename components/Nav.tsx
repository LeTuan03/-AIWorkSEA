"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavUser = { email: string; role: string } | null;

const links = [
  { href: "/", label: "Việc làm" },
  { href: "/freelancers", label: "Freelancer" },
  { href: "/companies", label: "Công ty" },
  { href: "/tools/quote", label: "Công cụ" },
  { href: "/about", label: "Về tôi" },
];

export function Nav({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkCls = (href: string) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive(href)
        ? "bg-accent-weak text-accent-weak-fg"
        : "text-muted hover:bg-surface-2 hover:text-fg"
    }`;

  const ghostCls =
    "rounded-xl px-3 py-2 text-sm font-medium text-subtle transition hover:bg-surface-2 hover:text-fg";

  return (
    <>
      {/* Desktop: centered menu ([Logo] [Menu Center] [CTA], §7) */}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={linkCls(l.href)}>
            {l.label}
          </Link>
        ))}
        {user && (
          <>
            <Link href="/tracker" className={linkCls("/tracker")}>
              Theo dõi
            </Link>
            <Link href="/dashboard" className={linkCls("/dashboard")}>
              Bảng điều khiển
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin" className={linkCls("/admin")}>
                Quản trị
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Desktop: right actions (CTA + toggle) */}
      <div className="hidden items-center gap-2 md:flex">
        {user ? (
          <form action={signOutAction}>
            <button type="submit" title={user.email} className={ghostCls}>
              Đăng xuất
            </button>
          </form>
        ) : (
          <Link href="/login" className={linkCls("/login")}>
            Đăng nhập
          </Link>
        )}
        <Link href="/post" className="btn btn-primary">
          {user ? "Đăng tin" : "Đăng tin tuyển"}
        </Link>
        <ThemeToggle />
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-1 md:hidden">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-fg transition hover:bg-surface-2"
        >
          {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line glass-band p-3 shadow-lg shadow-black/5 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/tracker" className={linkCls("/tracker")}>
                  Theo dõi
                </Link>
                <Link href="/dashboard" className={linkCls("/dashboard")}>
                  Bảng điều khiển
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className={linkCls("/admin")}>
                    Quản trị
                  </Link>
                )}
                <Link href="/post" className="btn btn-primary mt-1">
                  Đăng tin
                </Link>
                <form action={signOutAction} className="mt-1">
                  <button type="submit" className={`${ghostCls} w-full text-left`}>
                    Đăng xuất ({user.email})
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className={linkCls("/login")}>
                  Đăng nhập
                </Link>
                <Link href="/post" className="btn btn-primary mt-1">
                  Đăng tin tuyển
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
