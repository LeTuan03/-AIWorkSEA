"use client";

import { Info } from "lucide-react";
import { JobForm } from "@/components/JobForm";
import { createJobAction } from "@/app/post/actions";

export function PostForm() {
  return (
    <JobForm
      action={createJobAction}
      submitLabel="Đăng tin tuyển dụng"
      pendingLabel="Đang đăng…"
      note={
        <div className="flex gap-3 rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
          <Info size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <div>
            <p>
              Tin sau khi đăng sẽ ở trạng thái <strong className="font-semibold text-fg">chờ duyệt</strong> và
              hiển thị công khai sau khi được kiểm duyệt.
            </p>
            <p className="mt-2">
              Muốn tin <strong className="font-semibold text-fg">Nổi bật</strong> (ghim lên đầu)? Liên hệ chúng tôi
              để nâng cấp. Gói Featured được kích hoạt thủ công.
            </p>
          </div>
        </div>
      }
    />
  );
}
