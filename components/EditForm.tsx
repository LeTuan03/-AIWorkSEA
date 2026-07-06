"use client";

import { Info } from "lucide-react";
import { JobForm } from "@/components/JobForm";
import { updateJobAction } from "@/app/dashboard/actions";
import type { JobFormValues } from "@/lib/job-validation";

export function EditForm({
  jobId,
  initial,
}: {
  jobId: string;
  initial: JobFormValues;
}) {
  return (
    <JobForm
      action={updateJobAction}
      jobId={jobId}
      initial={initial}
      submitLabel="Cập nhật tin"
      pendingLabel="Đang lưu…"
      note={
        <div className="flex gap-3 rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
          <Info size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <p>
            Sau khi cập nhật, tin sẽ quay lại trạng thái <strong className="font-semibold text-fg">chờ duyệt</strong> và
            được kiểm duyệt lại trước khi hiển thị.
          </p>
        </div>
      }
    />
  );
}
