import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Query = Record<string, string | undefined>;

function buildHref(
  basePath: string,
  query: Query,
  page: number,
  hash: string,
): string {
  const sp = new URLSearchParams();
  for (const [k, val] of Object.entries(query)) {
    if (val) sp.set(k, val);
  }
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return `${basePath}${qs ? `?${qs}` : ""}${hash}`;
}

// Windowed page range: 1 … (p-1) p (p+1) … last
function pageWindow(page: number, totalPages: number): (number | "…")[] {
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  basePath = "/",
  hash = "",
  query = {},
}: {
  page: number;
  totalPages: number;
  basePath?: string;
  hash?: string;
  query?: Query;
}) {
  if (totalPages <= 1) return null;

  const window = pageWindow(page, totalPages);
  const base =
    "flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-medium transition";
  const outline = `${base} glass text-fg hover:bg-surface-2`;

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Phân trang">
      {page > 1 && (
        <Link href={buildHref(basePath, query, page - 1, hash)} className={outline} aria-label="Trang trước">
          <ChevronLeft size={16} strokeWidth={2} />
        </Link>
      )}

      {window.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-subtle">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(basePath, query, p, hash)}
            aria-current={p === page ? "page" : undefined}
            className={
              p === page
                ? `${base} bg-accent-solid text-accent-solid-fg`
                : outline
            }
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link href={buildHref(basePath, query, page + 1, hash)} className={outline} aria-label="Trang sau">
          <ChevronRight size={16} strokeWidth={2} />
        </Link>
      )}
    </nav>
  );
}
