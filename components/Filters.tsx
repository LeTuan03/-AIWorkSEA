"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  CATEGORIES,
  LOCATIONS,
  LOCATION_LABELS,
  SORTS,
} from "@/lib/constants";

type Props = {
  q?: string;
  category?: string;
  location?: string;
  sort?: string;
  remote?: boolean;
};

// Selects reuse the shared .field surface but stay auto-width.
const selectCls = "field w-auto";

// GET form + progressive enhancement: changing a select/toggle auto-submits.
// Works without JS too (there is an explicit search button).
export function Filters({ q, category, location, sort, remote }: Props) {
  const hasActiveFilter = Boolean(q || category || location || remote || sort);

  const autoSubmit = (e: React.ChangeEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).closest("form")?.requestSubmit();
  };

  return (
    <form
      method="GET"
      action="/"
      className="rounded-2xl glass p-4"
    >
      {/* Search row */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={q ?? ""}
            placeholder="Tìm theo kỹ năng, chức danh (RAG, n8n, PyTorch)"
            className="field pl-10"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Tìm
        </button>
      </div>

      {/* Filter row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select name="category" defaultValue={category ?? ""} onChange={autoSubmit} className={selectCls} aria-label="Lĩnh vực">
          <option value="">Tất cả lĩnh vực</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select name="location" defaultValue={location ?? ""} onChange={autoSubmit} className={selectCls} aria-label="Địa điểm">
          <option value="">Mọi địa điểm</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>{LOCATION_LABELS[l] ?? l}</option>
          ))}
        </select>

        <select name="sort" defaultValue={sort ?? "newest"} onChange={autoSubmit} className={selectCls} aria-label="Sắp xếp">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl glass px-3 py-2 text-sm text-fg transition hover:bg-surface-2">
          <input
            type="checkbox"
            name="remote"
            value="1"
            defaultChecked={remote}
            onChange={autoSubmit}
            className="h-4 w-4 rounded border-line-strong accent-[var(--accent-solid)]"
          />
          Chỉ Remote
        </label>

        {hasActiveFilter && (
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-fg"
          >
            <X size={15} strokeWidth={2} aria-hidden />
            Xóa lọc
          </Link>
        )}
      </div>
    </form>
  );
}
