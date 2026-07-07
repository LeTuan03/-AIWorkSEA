import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { Nav } from "@/components/Nav";

export async function Header() {
  const user = await getCurrentUser();
  const navUser = user ? { email: user.email, role: user.role } : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line glass-band">
      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          aria-label="AIWork SEA, trang chủ"
          className="flex items-center gap-2.5 rounded-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-accent-solid-fg">
            <img
              src="/icon.jpg"
              alt="AIWork SEA Logo"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-fg">
            AIWork<span className="text-accent">SEA</span>
          </span>
        </Link>

        <Nav user={navUser} />
      </div>
    </header>
  );
}
