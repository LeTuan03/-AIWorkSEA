// Minimal email sender over the Resend REST API — no SDK dependency. Degrades
// gracefully: with no RESEND_API_KEY set (local dev), it logs instead of sending
// so the double opt-in flow is still testable.

export type SendResult = { ok: boolean; skipped?: boolean };

const FROM_FALLBACK = "AIWork SEA <onboarding@resend.dev>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? FROM_FALLBACK;

  if (!key) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping send to ${opts.to} ("${opts.subject}")`,
    );
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, html: opts.html }),
    });
    if (!res.ok) {
      console.error("[email] Resend send failed", res.status, await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Resend request error", err);
    return { ok: false };
  }
}
