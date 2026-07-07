"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveProfileAction } from "@/app/freelancer/edit/actions";
import type { ProfileFormValues } from "@/lib/profile-validation";
import {
  AVAILABILITY,
  AVAILABILITY_LABELS,
  VISIBILITY,
  VISIBILITY_LABELS,
  PROFILE_LIMITS,
} from "@/lib/constants";

const labelCls = "mb-1 block text-sm font-medium text-fg";
const inputCls = "field";
const legendCls = "text-sm font-semibold text-fg";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
      {pending ? "Đang lưu…" : "Lưu hồ sơ"}
    </button>
  );
}

export function ProfileForm({ initial }: { initial?: ProfileFormValues }) {
  const [state, formAction] = useActionState(saveProfileAction, {});
  const v = state?.values ?? initial;

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-xl border border-line bg-danger-weak px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Identity */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>Hồ sơ</legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="displayName" className={labelCls}>
              Tên hiển thị <span className="text-danger">*</span>
            </label>
            <input
              id="displayName"
              name="displayName"
              required
              maxLength={PROFILE_LIMITS.displayName}
              defaultValue={v?.displayName ?? ""}
              placeholder="VD: Nguyễn Minh"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="username" className={labelCls}>
              Username (đường dẫn) <span className="text-danger">*</span>
            </label>
            <input
              id="username"
              name="username"
              required
              maxLength={PROFILE_LIMITS.username}
              defaultValue={v?.username ?? ""}
              placeholder="nguyen-ai"
              pattern="[a-zA-Z0-9\-]{3,30}"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-muted">
              Trang của bạn: /freelancer/<span className="text-fg">username</span> — chữ thường, số, gạch nối.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="headline" className={labelCls}>
            Tiêu đề ngắn (1 dòng)
          </label>
          <input
            id="headline"
            name="headline"
            maxLength={PROFILE_LIMITS.headline}
            defaultValue={v?.headline ?? ""}
            placeholder="VD: Kỹ sư RAG & tự động hoá n8n cho SME"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="bio" className={labelCls}>
            Giới thiệu <span className="text-danger">*</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            required
            rows={6}
            maxLength={PROFILE_LIMITS.bio}
            defaultValue={v?.bio ?? ""}
            placeholder="Kinh nghiệm, loại dự án bạn nhận, cách bạn làm việc…"
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
            maxLength={PROFILE_LIMITS.skills}
            defaultValue={v?.skills ?? ""}
            placeholder="Python, LangChain, RAG, n8n, OpenAI API"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-muted">Ngăn cách bằng dấu phẩy.</p>
        </div>
      </fieldset>

      {/* Links & rate */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>Liên kết & mức giá</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="portfolioUrl" className={labelCls}>Link portfolio</label>
            <input id="portfolioUrl" name="portfolioUrl" type="url" maxLength={PROFILE_LIMITS.portfolioUrl} defaultValue={v?.portfolioUrl ?? ""} placeholder="https://…" className={inputCls} />
          </div>
          <div>
            <label htmlFor="avatarUrl" className={labelCls}>Link ảnh đại diện</label>
            <input id="avatarUrl" name="avatarUrl" type="url" maxLength={PROFILE_LIMITS.avatarUrl} defaultValue={v?.avatarUrl ?? ""} placeholder="https://…" className={inputCls} />
          </div>
          <div>
            <label htmlFor="rateReference" className={labelCls}>Mức giá tham khảo</label>
            <input id="rateReference" name="rateReference" maxLength={PROFILE_LIMITS.rateReference} defaultValue={v?.rateReference ?? ""} placeholder="VD: 500k-1tr/giờ hoặc theo dự án" className={inputCls} />
          </div>
        </div>
      </fieldset>

      {/* Contact — shown publicly */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>Liên hệ (hiển thị công khai)</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactEmail" className={labelCls}>Email</label>
            <input id="contactEmail" name="contactEmail" type="email" maxLength={PROFILE_LIMITS.contactEmail} defaultValue={v?.contactEmail ?? ""} placeholder="ban@email.com" className={inputCls} />
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelCls}>Điện thoại / Zalo</label>
            <input id="contactPhone" name="contactPhone" maxLength={PROFILE_LIMITS.contactPhone} defaultValue={v?.contactPhone ?? ""} placeholder="Tuỳ chọn" className={inputCls} />
          </div>
        </div>
      </fieldset>

      {/* Status */}
      <fieldset className="space-y-4">
        <legend className={legendCls}>Trạng thái</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="availability" className={labelCls}>Nhận việc</label>
            <select id="availability" name="availability" defaultValue={v?.availability ?? "OPEN"} className={inputCls}>
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>{AVAILABILITY_LABELS[a]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="visibility" className={labelCls}>Hiển thị</label>
            <select id="visibility" name="visibility" defaultValue={v?.visibility ?? "PUBLIC"} className={inputCls}>
              {VISIBILITY.map((vis) => (
                <option key={vis} value={vis}>{VISIBILITY_LABELS[vis]}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <SubmitButton />
      </div>
    </form>
  );
}
