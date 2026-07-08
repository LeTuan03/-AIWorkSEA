"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Mail } from "lucide-react";
import { subscribeAction } from "@/app/newsletter/actions";

function SubmitButton({ compact }: { compact?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary shrink-0">
      {pending ? "Đang gửi…" : compact ? "Đăng ký" : "Nhận bản tin"}
    </button>
  );
}

// Newsletter opt-in form. `source` tags where the signup came from; `compact`
// renders the footer variant.
export function NewsletterForm({
  source = "home",
  compact = false,
}: {
  source?: string;
  compact?: boolean;
}) {
  const [state, formAction] = useActionState(subscribeAction, {});

  if (state.ok && state.message) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-line bg-success-weak px-4 py-3 text-sm text-success">
        <CheckCircle2 size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
        <span>{state.message}</span>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          {!compact && (
            <Mail
              size={18}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle"
              aria-hidden
            />
          )}
          <input
            name="email"
            type="email"
            required
            aria-label="Email nhận bản tin"
            placeholder="aiworksea@gmail.com"
            maxLength={200}
            className={`field ${compact ? "" : "pl-11"}`}
          />
        </div>
        <input type="hidden" name="source" value={source} />
        {/* Honeypot */}
        <div aria-hidden className="absolute left-[-9999px] top-[-9999px]">
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </div>
        <SubmitButton compact={compact} />
      </div>
      {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
    </form>
  );
}
