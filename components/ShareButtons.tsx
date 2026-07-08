"use client";

import { Link2 } from "lucide-react";
import { toast } from "@/components/Toast";
import { FacebookIcon, XIcon, LinkedInIcon } from "@/components/BrandIcons";

export function ShareButtons({ title, url }: { title: string; url?: string }) {
  // Default: share the page we're on. Pass `url` to share something else
  // (e.g. the homepage from the tracker's "got the job" prompt).
  const currentUrl = () =>
    url ?? (typeof window !== "undefined" ? window.location.href : "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      toast("Đã sao chép liên kết.", "success");
    } catch {
      toast("Không sao chép được.", "error");
    }
  };

  const openShare = (base: string, extra: Record<string, string> = {}) => {
    const params = new URLSearchParams({ ...extra });
    window.open(`${base}?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-xl border border-line-strong text-muted transition hover:bg-surface-2 hover:text-fg";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Chia sẻ:</span>
      <button type="button" onClick={copy} className={btn} title="Sao chép liên kết" aria-label="Sao chép liên kết">
        <Link2 size={16} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => openShare("https://www.facebook.com/sharer/sharer.php", { u: currentUrl() })}
        className={btn}
        title="Chia sẻ Facebook"
        aria-label="Chia sẻ Facebook"
      >
        <FacebookIcon size={15} />
      </button>
      <button
        type="button"
        onClick={() => openShare("https://twitter.com/intent/tweet", { url: currentUrl(), text: title })}
        className={btn}
        title="Chia sẻ X"
        aria-label="Chia sẻ X"
      >
        <XIcon size={14} />
      </button>
      <button
        type="button"
        onClick={() => openShare("https://www.linkedin.com/sharing/share-offsite/", { url: currentUrl() })}
        className={btn}
        title="Chia sẻ LinkedIn"
        aria-label="Chia sẻ LinkedIn"
      >
        <LinkedInIcon size={15} />
      </button>
    </div>
  );
}
