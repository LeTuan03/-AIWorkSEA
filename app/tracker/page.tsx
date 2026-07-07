import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { getCardsByUser } from "@/lib/tracker";
import { KanbanBoard } from "@/components/tracker/KanbanBoard";

export const metadata: Metadata = {
  title: "Theo dõi ứng tuyển",
  robots: { index: false },
};

export default async function TrackerPage() {
  const user = await requireUser();
  const cards = await getCardsByUser(user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        Bảng theo dõi ứng tuyển
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Kéo-thả để cập nhật trạng thái từng việc bạn đang ứng tuyển. Bấm “Lưu vào
        bảng theo dõi” trên một tin việc để tự động thêm thẻ vào đây.
      </p>

      <div className="mt-6">
        <KanbanBoard initialCards={cards} />
      </div>
    </div>
  );
}
