import { redirect } from "next/navigation";
import { unsubscribeByToken } from "@/lib/newsletter";

// One-click unsubscribe link target (used in every digest email).
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (token) await unsubscribeByToken(token);
  redirect("/?toast=unsubscribed");
}
