import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { recordEvent, isValidEventName } from "@/lib/analytics";

// Collector for the client-side tracker (components/Analytics.tsx).
// Accepts { name, path?, refId? }, validates against the allowlist and writes
// one Event row. Always returns 204 so the client never retries or logs.

export async function POST(request: Request) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    "unknown";

  // Generous cap — a human browsing fast stays well under it.
  if (!rateLimit(`track:${ip}`, 120, 60_000)) {
    return new Response(null, { status: 204 });
  }

  let body: { name?: string; path?: string; refId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 204 });
  }

  const name = String(body.name ?? "");
  if (!isValidEventName(name)) return new Response(null, { status: 204 });

  // Never track the admin area.
  const path = typeof body.path === "string" ? body.path : undefined;
  if (path?.startsWith("/admin")) return new Response(null, { status: 204 });

  await recordEvent(name, {
    path,
    refId: typeof body.refId === "string" ? body.refId : undefined,
  });

  return new Response(null, { status: 204 });
}
