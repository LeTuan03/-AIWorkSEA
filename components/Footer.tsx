import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-line glass-band">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-solid text-xs font-bold text-accent-solid-fg">
                AI
              </span>
              <span className="font-display font-bold text-fg">
                AIWork<span className="text-accent">SEA</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Job board chuyên tuyển freelancer AI &amp; Automation ở Đông Nam Á.
            </p>
          </div>

          <FooterCol
            title="Ứng viên"
            items={[
              { href: "/", label: "Tìm việc" },
              { href: "/companies", label: "Công ty" },
              { href: "/feed.xml", label: "RSS", external: true },
            ]}
          />
          <FooterCol
            title="Nhà tuyển dụng"
            items={[
              { href: "/post", label: "Đăng tin" },
              { href: "/signup", label: "Tạo tài khoản" },
              { href: "/dashboard", label: "Bảng điều khiển" },
            ]}
          />
          <FooterCol
            title="Khác"
            items={[
              { href: "/#how", label: "Cách hoạt động" },
              { href: "/login", label: "Đăng nhập" },
            ]}
          />
        </div>

        <div className="mt-12 border-t border-line pt-6 text-xs text-subtle">
          © {year} AIWork SEA. Bản MVP, dữ liệu hiển thị là mẫu.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-fg">{title}</span>
      {items.map((it) =>
        it.external ? (
          <a
            key={it.href}
            href={it.href}
            className="text-sm text-muted transition hover:text-accent"
          >
            {it.label}
          </a>
        ) : (
          <Link
            key={it.href}
            href={it.href}
            className="text-sm text-muted transition hover:text-accent"
          >
            {it.label}
          </Link>
        ),
      )}
    </div>
  );
}
