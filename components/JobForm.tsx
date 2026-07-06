"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { JobFormState, JobFormValues } from "@/lib/job-validation";
import {
  CATEGORIES,
  LOCATIONS,
  WORK_TYPES,
  ENGAGEMENTS,
  CURRENCIES,
  LIMITS,
} from "@/lib/constants";

const labelCls = "mb-1 block text-sm font-medium text-fg";
const inputCls = "field";
const legendCls = "text-sm font-semibold text-fg";

type JobAction = (
  state: JobFormState,
  formData: FormData,
) => Promise<JobFormState>;

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full sm:w-auto"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function JobForm({
  action,
  initial,
  jobId,
  submitLabel,
  pendingLabel,
  note,
}: {
  action: JobAction;
  initial?: JobFormValues;
  jobId?: string;
  submitLabel: string;
  pendingLabel: string;
  note?: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, {});
  // First render: prefill from `initial` (edit mode). After a validation error:
  // React 19 resets fields to their (updated) defaultValue, so echoing
  // state.values preserves what the user typed.
  const v = state?.values ?? initial;

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-xl border border-line bg-danger-weak px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {jobId && <input type="hidden" name="jobId" value={jobId} />}

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Basics */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>
          Thông tin cơ bản
        </legend>

        <div>
          <label htmlFor="title" className={labelCls}>
            Tiêu đề công việc <span className="text-danger">*</span>
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={LIMITS.title}
            defaultValue={v?.title ?? ""}
            placeholder="VD: LLM Engineer, xây dựng RAG chatbot"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className={labelCls}>
              Công ty / Cá nhân <span className="text-danger">*</span>
            </label>
            <input
              id="company"
              name="company"
              required
              maxLength={LIMITS.company}
              defaultValue={v?.company ?? ""}
              placeholder="VD: Lexa AI"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="companyUrl" className={labelCls}>
              Website (tùy chọn)
            </label>
            <input
              id="companyUrl"
              name="companyUrl"
              type="url"
              maxLength={LIMITS.companyUrl}
              defaultValue={v?.companyUrl ?? ""}
              placeholder="https://…"
              className={inputCls}
            />
          </div>
        </div>
      </fieldset>

      {/* Classification */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>
          Phân loại
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className={labelCls}>
              Lĩnh vực <span className="text-danger">*</span>
            </label>
            <select id="category" name="category" defaultValue={v?.category ?? CATEGORIES[0]} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className={labelCls}>
              Địa điểm <span className="text-danger">*</span>
            </label>
            <select id="location" name="location" defaultValue={v?.location ?? LOCATIONS[0]} className={inputCls}>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="workType" className={labelCls}>
              Hình thức làm việc <span className="text-danger">*</span>
            </label>
            <select id="workType" name="workType" defaultValue={v?.workType ?? WORK_TYPES[0]} className={inputCls}>
              {WORK_TYPES.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="engagement" className={labelCls}>
              Loại hợp đồng <span className="text-danger">*</span>
            </label>
            <select id="engagement" name="engagement" defaultValue={v?.engagement ?? ENGAGEMENTS[0]} className={inputCls}>
              {ENGAGEMENTS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Budget */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>
          Ngân sách (tùy chọn)
        </legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="budgetMin" className={labelCls}>Tối thiểu</label>
            <input id="budgetMin" name="budgetMin" type="number" min="0" defaultValue={v?.budgetMin ?? ""} placeholder="3000" className={inputCls} />
          </div>
          <div>
            <label htmlFor="budgetMax" className={labelCls}>Tối đa</label>
            <input id="budgetMax" name="budgetMax" type="number" min="0" defaultValue={v?.budgetMax ?? ""} placeholder="6000" className={inputCls} />
          </div>
          <div>
            <label htmlFor="currency" className={labelCls}>Tiền tệ</label>
            <select id="currency" name="currency" defaultValue={v?.currency ?? "USD"} className={inputCls}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-muted">
          Với hợp đồng Part-time, ngân sách được hiểu là mức theo giờ.
        </p>
      </fieldset>

      {/* Details */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>
          Chi tiết
        </legend>

        <div>
          <label htmlFor="description" className={labelCls}>
            Mô tả công việc <span className="text-danger">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={7}
            maxLength={LIMITS.description}
            defaultValue={v?.description ?? ""}
            placeholder="Mô tả dự án, phạm vi công việc, yêu cầu kinh nghiệm…"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="skills" className={labelCls}>
            Kỹ năng <span className="text-danger">*</span>
          </label>
          <input
            id="skills"
            name="skills"
            required
            maxLength={LIMITS.skills}
            defaultValue={v?.skills ?? ""}
            placeholder="Python, LangChain, RAG, pgvector"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-muted">Ngăn cách bằng dấu phẩy.</p>
        </div>
      </fieldset>

      {/* Apply */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>
          Cách ứng tuyển <span className="text-danger">*</span>
        </legend>
        <p className="text-xs text-muted">Điền ít nhất một trong hai.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="applyUrl" className={labelCls}>Link ứng tuyển</label>
            <input id="applyUrl" name="applyUrl" type="url" maxLength={LIMITS.applyUrl} defaultValue={v?.applyUrl ?? ""} placeholder="https://…" className={inputCls} />
          </div>
          <div>
            <label htmlFor="applyEmail" className={labelCls}>Email nhận hồ sơ</label>
            <input id="applyEmail" name="applyEmail" type="email" maxLength={LIMITS.applyEmail} defaultValue={v?.applyEmail ?? ""} placeholder="talent@company.com" className={inputCls} />
          </div>
        </div>
      </fieldset>

      {note}

      <div className="flex items-center gap-4">
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
      </div>
    </form>
  );
}
