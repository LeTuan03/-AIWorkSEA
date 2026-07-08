"use client";

import { toast } from "@/components/Toast";
import { applyClickAction } from "@/app/tracker/actions";

// Apply CTA on the job detail page. Navigation happens natively (new tab for
// URLs, mail client for emails); on click we also record the apply event and
// auto-create a tracker card for signed-in freelancers (GĐ1).
export function ApplyButton({
  jobId,
  href,
  external,
  ariaLabel,
}: {
  jobId: string;
  href: string;
  external: boolean;
  ariaLabel: string;
}) {
  const onClick = () => {
    void applyClickAction(jobId).then((res) => {
      if (res?.tracked) {
        toast("Đã tự động lưu vào bảng theo dõi của bạn.", "success");
      }
    });
  };

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className="btn btn-primary mt-6 w-full"
      onClick={onClick}
    >
      Ứng tuyển ngay
    </a>
  );
}
