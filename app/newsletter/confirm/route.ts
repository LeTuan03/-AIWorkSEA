import { redirect } from "next/navigation";
import { confirmSubscriber } from "@/lib/newsletter";
import { rateLimit } from "@/lib/rate-limit";
import { ipFromHeaders } from "@/lib/request";

// Confirm tokens are 64 hex chars (see token() in lib/newsletter.ts).
const CONFIRM_TOKEN_RE = /^[0-9a-f]{64}$/;

// Double opt-in confirmation link target.
export async function GET(request: Request) {
  const ip = ipFromHeaders(request.headers);
  if (!rateLimit(`newsletter-confirm:${ip}`, 10, 60_000)) {
    redirect("/?toast=confirm-failed");
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (CONFIRM_TOKEN_RE.test(token)) {
    const sub = await confirmSubscriber(token);
    if (sub) redirect("/?toast=confirmed");
  }
  redirect("/?toast=confirm-failed");
}
