import { redirect } from "next/navigation";
import { confirmSubscriber } from "@/lib/newsletter";

// Double opt-in confirmation link target.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (token) {
    const sub = await confirmSubscriber(token);
    if (sub) redirect("/?toast=confirmed");
  }
  redirect("/?toast=confirm-failed");
}
