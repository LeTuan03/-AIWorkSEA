"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signupAction, type AuthState } from "@/app/(auth)/actions";

const initial: AuthState = {};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
    </button>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signupAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-xl border border-line bg-danger-weak px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {/* Honeypot */}
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
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-fg">
          Tên (tùy chọn)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={100}
          autoComplete="name"
          defaultValue={state?.values?.name ?? ""}
          placeholder="Nguyễn Văn A / Công ty ABC"
          className="field"
        />
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
          maxLength={200}
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
          minLength={8}
          autoComplete="new-password"
          placeholder="Tối thiểu 8 ký tự"
          className="field"
        />
      </div>

      <Submit />
    </form>
  );
}
