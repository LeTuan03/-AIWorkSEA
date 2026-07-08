import { headers } from "next/headers";

// Best-effort client IP for rate-limit keys. Behind a proxy/CDN the first
// x-forwarded-for entry is the caller; "unknown" still rate-limits globally.
export function ipFromHeaders(h: Headers): string {
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

// For Server Actions / RSC where there is no Request object.
export async function clientIp(): Promise<string> {
  return ipFromHeaders(await headers());
}
