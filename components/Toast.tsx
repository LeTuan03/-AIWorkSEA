"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircleCheck, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };

// Messages triggered via `?toast=<key>` after a server action redirect.
const URL_MESSAGES: Record<string, { message: string; type: ToastType }> = {
  posted: { message: "Đã gửi tin! Tin đang chờ kiểm duyệt.", type: "success" },
  updated: { message: "Đã cập nhật! Tin sẽ được kiểm duyệt lại.", type: "success" },
  closed: { message: "Đã đóng tin.", type: "info" },
  approved: { message: "Đã duyệt và đăng tin.", type: "success" },
  rejected: { message: "Đã gỡ tin.", type: "info" },
  featured: { message: "Đã cập nhật trạng thái Nổi bật.", type: "success" },
  copied: { message: "Đã sao chép liên kết.", type: "success" },
};

let counter = 0;

// Client-side trigger for ad-hoc toasts (e.g. copy-to-clipboard).
export function toast(message: string, type: ToastType = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app:toast", { detail: { message, type } }));
}

function ToastFromUrl({ onToast }: { onToast: (m: string, t: ToastType) => void }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const key = sp.get("toast");
    if (!key || !URL_MESSAGES[key]) return;
    onToast(URL_MESSAGES[key].message, URL_MESSAGES[key].type);
    const params = new URLSearchParams(Array.from(sp.entries()));
    params.delete("toast");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [sp, pathname, router, onToast]);

  return null;
}

const STYLES: Record<ToastType, string> = {
  success: "glass text-fg",
  error: "glass text-fg",
  info: "glass text-fg",
};
const ICON_COLOR: Record<ToastType, string> = {
  success: "text-success",
  error: "text-danger",
  info: "text-accent",
};
const ICONS: Record<ToastType, LucideIcon> = {
  success: CircleCheck,
  error: TriangleAlert,
  info: Info,
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, type: ToastType) => {
    const id = ++counter;
    setItems((s) => [...s, { id, message, type }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 4200);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string; type: ToastType };
      push(detail.message, detail.type);
    };
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, [push]);

  return (
    <>
      <Suspense fallback={null}>
        <ToastFromUrl onToast={push} />
      </Suspense>
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,22rem)] flex-col gap-2">
        {items.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              role="status"
              className={`animate-float-in pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg shadow-black/10 ${STYLES[t.type]}`}
            >
              <Icon size={18} strokeWidth={1.75} className={`mt-0.5 shrink-0 ${ICON_COLOR[t.type]}`} aria-hidden />
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))}
                className="text-subtle transition hover:text-fg"
                aria-label="Đóng"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
