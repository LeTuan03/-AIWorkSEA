"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  label: string;
  buttonClassName: string;
  confirmTitle: string;
  confirmText: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
};

// A submit button that opens a confirmation modal before running its server
// action. Prevents accidental destructive actions (close / reject / remove).
export function ConfirmForm({
  action,
  fields,
  label,
  buttonClassName,
  confirmTitle,
  confirmText,
  confirmLabel = "Xác nhận",
  variant = "danger",
}: Props) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <form ref={formRef} action={action}>
        {Object.entries(fields).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <button type="button" onClick={() => setOpen(true)} className={buttonClassName}>
          {label}
        </button>
      </form>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="animate-float-in glass-modal w-full max-w-[420px] p-7">
            <h3 className="font-display text-lg font-semibold text-fg">{confirmTitle}</h3>
            <p className="mt-2 text-sm text-muted">{confirmText}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-secondary"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  formRef.current?.requestSubmit();
                }}
                className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
