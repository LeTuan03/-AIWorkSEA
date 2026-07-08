"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Client half of the first-party analytics (see lib/analytics.ts).
// track() posts to /api/track; sendBeacon survives page unload (apply clicks).

export function track(
  name: string,
  opts: { path?: string; refId?: string } = {},
): void {
  try {
    const payload = JSON.stringify({
      name,
      path: opts.path ?? window.location.pathname,
      refId: opts.refId,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    /* analytics must never break the page */
  }
}

// Mounted once in the root layout — records a pageview per route change.
export function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    track("pageview", { path: pathname });
  }, [pathname]);

  return null;
}

// Drop into a Server Component to record a named event on mount, e.g.
// <TrackEvent name="job_view" refId={job.id} /> on the job detail page.
export function TrackEvent({ name, refId }: { name: string; refId?: string }) {
  useEffect(() => {
    track(name, { refId });
    // Fire once per mount, even if props are referentially unstable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
