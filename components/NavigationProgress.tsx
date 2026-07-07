"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// A global top loading bar for App Router soft navigations.
//
// Why this exists: clicking a <Link> (e.g. a JobCard) kicks off a server
// round-trip (DB fetch) before the new page renders. Without feedback the old
// page just sits there and the click feels ignored. This bar starts the instant
// an internal link is clicked and finishes when the route (path or query) settles.
function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  // Controls shared across effects; built once so setState identities stay stable.
  const ctl = useRef<{
    active: boolean;
    trickle?: ReturnType<typeof setInterval>;
    hide?: ReturnType<typeof setTimeout>;
    safety?: ReturnType<typeof setTimeout>;
    start: () => void;
    done: () => void;
  }>(null as never);

  if (!ctl.current) {
    ctl.current = {
      active: false,
      start() {
        if (this.active) return;
        this.active = true;
        clearTimeout(this.hide);
        setVisible(true);
        setWidth(10);
        // Ease toward 90% so the bar keeps moving while the server responds.
        this.trickle = setInterval(() => {
          setWidth((w) => (w >= 90 ? w : w + (90 - w) * 0.08 + 0.4));
        }, 240);
        // Never let a stuck navigation leave the bar hanging forever.
        this.safety = setTimeout(() => this.done(), 10000);
      },
      done() {
        if (!this.active) return;
        this.active = false;
        clearInterval(this.trickle);
        clearTimeout(this.safety);
        setWidth(100);
        this.hide = setTimeout(() => {
          setVisible(false);
          setWidth(0);
        }, 280);
      },
    };
  }

  // Finish whenever the route settles. On first mount `active` is false, so this
  // no-ops — no need to guard the initial render.
  useEffect(() => {
    ctl.current.done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Start on any internal navigation.
  useEffect(() => {
    const c = ctl.current;

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same path + query = hash jump or re-click; no route change is coming,
      // so don't start a bar that would never finish.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }
      c.start();
    };

    const onPopState = () => c.start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearInterval(c.trickle);
      clearTimeout(c.hide);
      clearTimeout(c.safety);
    };
  }, []);

  return (
    <div className="nav-progress" data-visible={visible} aria-hidden>
      <div className="nav-progress-bar" style={{ width: `${width}%` }} />
    </div>
  );
}

// useSearchParams needs a Suspense boundary so it doesn't opt the whole tree
// into client rendering during static export.
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
