import { redirect } from "next/navigation";
import { unsubscribeByToken } from "@/lib/newsletter";
import { rateLimit } from "@/lib/rate-limit";
import { ipFromHeaders } from "@/lib/request";

// Unsub tokens are cuids (Subscriber.unsubToken @default(cuid())).
const UNSUB_TOKEN_RE = /^[a-z0-9]{20,40}$/;

// One-click unsubscribe link target (used in every digest email).
export async function GET(request: Request) {
  const ip = ipFromHeaders(request.headers);
  if (!rateLimit(`newsletter-unsub:${ip}`, 20, 60_000)) {
    redirect("/?toast=unsubscribed");
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (UNSUB_TOKEN_RE.test(token)) await unsubscribeByToken(token);
  redirect("/?toast=unsubscribed");
}
