"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type AuthState } from "@/app/(auth)/actions";

const initial: AuthState = {};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending ? "Đang đăng nhập…" : "Đăng nhập"}
    </button>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-xl border border-line bg-danger-weak px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {/* Honeypot — hidden from users, tempting for bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-fg">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state?.values?.email ?? ""}
          placeholder="you@company.com"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-fg">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="field"
        />
      </div>

      <Submit />
    </form>
  );
}
