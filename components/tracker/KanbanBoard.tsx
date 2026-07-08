"use client";

import { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, ExternalLink, GripVertical, PartyPopper, X } from "lucide-react";
import { TRACKER_COLUMNS } from "@/lib/constants";
import { ShareButtons } from "@/components/ShareButtons";
import type { TrackerCard } from "@/lib/tracker";
import {
  createCardAction,
  deleteCardAction,
  moveCardAction,
} from "@/app/tracker/actions";

type Cols = Record<string, TrackerCard[]>;

function group(cards: TrackerCard[]): Cols {
  const cols: Cols = {};
  for (const { key } of TRACKER_COLUMNS) cols[key] = [];
  for (const c of cards) (cols[c.column] ?? (cols[c.column] = [])).push(c);
  for (const key of Object.keys(cols)) cols[key].sort((a, b) => a.order - b.order);
  return cols;
}

function findContainer(cols: Cols, id: string): string | null {
  if (id in cols) return id;
  return (
    Object.keys(cols).find((k) => cols[k].some((c) => c.id === id)) ?? null
  );
}

export function KanbanBoard({ initialCards }: { initialCards: TrackerCard[] }) {
  const [cols, setColsState] = useState<Cols>(() => group(initialCards));
  const colsRef = useRef(cols);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Referral nudge (GĐ3): remember where a drag started so we can celebrate
  // when a card lands in OFFER coming from another column.
  const dragFromCol = useRef<string | null>(null);
  const [shareFor, setShareFor] = useState<TrackerCard | null>(null);

  const applyCols = (next: Cols) => {
    colsRef.current = next;
    setColsState(next);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const persist = (col: string) =>
    void moveCardAction(col, colsRef.current[col].map((c) => c.id));

  function onDragStart(e: DragStartEvent) {
    const id = String(e.active.id);
    setActiveId(id);
    dragFromCol.current = findContainer(colsRef.current, id);
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const cur = colsRef.current;
    const activeCol = findContainer(cur, activeId);
    const overCol = overId in cur ? overId : findContainer(cur, overId);
    if (!activeCol || !overCol || activeCol === overCol) return;

    const activeItems = cur[activeCol];
    const overItems = cur[overCol];
    const idx = activeItems.findIndex((c) => c.id === activeId);
    if (idx < 0) return;
    const moving = activeItems[idx];
    let overIndex = overId in cur ? overItems.length : overItems.findIndex((c) => c.id === overId);
    if (overIndex < 0) overIndex = overItems.length;

    applyCols({
      ...cur,
      [activeCol]: activeItems.filter((c) => c.id !== activeId),
      [overCol]: [
        ...overItems.slice(0, overIndex),
        { ...moving, column: overCol },
        ...overItems.slice(overIndex),
      ],
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const cur = colsRef.current;
    const activeCol = findContainer(cur, activeId);
    const overCol = overId in cur ? overId : findContainer(cur, overId);
    if (!activeCol || !overCol) return;

    if (activeCol === overCol) {
      const items = cur[activeCol];
      const oldIndex = items.findIndex((c) => c.id === activeId);
      const newIndex = overId in cur ? items.length - 1 : items.findIndex((c) => c.id === overId);
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        applyCols({ ...cur, [activeCol]: arrayMove(items, oldIndex, newIndex) });
      }
    }
    persist(overCol);

    // Landed in "Đã nhận" from somewhere else: congratulate + suggest sharing.
    if (overCol === "OFFER" && dragFromCol.current !== "OFFER") {
      const moved = colsRef.current.OFFER.find((c) => c.id === activeId);
      if (moved) setShareFor(moved);
    }
    dragFromCol.current = null;
  }

  async function addCard() {
    const title = newTitle.trim();
    if (!title) return;
    setAdding(true);
    setError(null);
    const res = await createCardAction({ title });
    setAdding(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setNewTitle("");
    const cur = colsRef.current;
    applyCols({ ...cur, SENT: [...cur.SENT, res.card] });
  }

  async function removeCard(col: string, id: string) {
    const cur = colsRef.current;
    applyCols({ ...cur, [col]: cur[col].filter((c) => c.id !== id) });
    await deleteCardAction(id);
  }

  const activeCard = activeId
    ? Object.values(cols).flat().find((c) => c.id === activeId) ?? null
    : null;

  return (
    <div>
      {/* Quick add */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void addCard();
            }
          }}
          placeholder="Thêm việc đang ứng tuyển…"
          maxLength={200}
          className="field sm:max-w-md"
        />
        <button type="button" onClick={() => void addCard()} disabled={adding} className="btn btn-primary">
          <Plus size={16} strokeWidth={2} aria-hidden />
          {adding ? "Đang thêm…" : "Thêm thẻ"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKER_COLUMNS.map((col) => (
            <Column
              key={col.key}
              colKey={col.key}
              label={col.label}
              cards={cols[col.key] ?? []}
              onDelete={removeCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? <CardBody card={activeCard} dragging /> : null}
        </DragOverlay>
      </DndContext>

      {/* "Đã nhận việc" referral prompt (GĐ3) — light nudge, no reward scheme. */}
      {shareFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Chia sẻ AIWORK SEA"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShareFor(null);
          }}
        >
          <div className="animate-float-in glass-modal relative w-full max-w-[440px] p-7">
            <button
              type="button"
              onClick={() => setShareFor(null)}
              aria-label="Đóng"
              className="absolute right-4 top-4 text-subtle transition hover:text-fg"
            >
              <X size={18} strokeWidth={2} aria-hidden />
            </button>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
              <PartyPopper size={22} strokeWidth={1.75} aria-hidden />
            </span>
            <h3 className="font-display mt-4 text-lg font-semibold text-fg">
              Chúc mừng bạn nhận việc {shareFor.title}!
            </h3>
            <p className="mt-2 text-sm text-muted">
              Quen ai đang tìm dự án AI &amp; Automation? Giới thiệu AIWORK SEA
              cho họ — càng nhiều freelancer chất lượng, càng nhiều nhà tuyển
              dụng tìm đến.
            </p>
            <div className="mt-5">
              <ShareButtons
                title="Mình vừa nhận việc qua AIWORK SEA — job board cho freelancer AI & Automation ở Đông Nam Á"
                url={typeof window !== "undefined" ? window.location.origin : ""}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShareFor(null)}
                className="btn btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Column({
  colKey,
  label,
  cards,
  onDelete,
}: {
  colKey: string;
  label: string;
  cards: TrackerCard[];
  onDelete: (col: string, id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: colKey });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-line p-3 transition ${
        isOver ? "bg-accent-weak/40" : "bg-surface-2"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-fg">{label}</span>
        <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
          {cards.length}
        </span>
      </div>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-16 flex-col gap-2">
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} onDelete={onDelete} />
          ))}
          {cards.length === 0 && (
            <div className="rounded-xl border border-dashed border-line-strong p-4 text-center text-xs text-subtle">
              Kéo thẻ vào đây
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableCard({
  card,
  onDelete,
}: {
  card: TrackerCard;
  onDelete: (col: string, id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <CardBody card={card} onDelete={onDelete} handleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

function CardBody({
  card,
  onDelete,
  handleProps,
  dragging,
}: {
  card: TrackerCard;
  onDelete?: (col: string, id: string) => void;
  handleProps?: React.HTMLAttributes<HTMLButtonElement>;
  dragging?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-line bg-surface p-3 ${
        dragging ? "shadow-lg shadow-black/10" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="Kéo để di chuyển"
          className="mt-0.5 shrink-0 cursor-grab text-subtle active:cursor-grabbing"
          {...handleProps}
        >
          <GripVertical size={16} strokeWidth={1.75} aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-fg">{card.title}</div>
          {card.company && <div className="mt-0.5 text-xs text-muted">{card.company}</div>}
          {card.notes && (
            <div className="mt-1 line-clamp-2 text-xs text-subtle">{card.notes}</div>
          )}
          {card.link && (
            <a
              href={card.link}
              target={card.link.startsWith("/") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              <ExternalLink size={12} strokeWidth={1.75} aria-hidden />
              Xem tin
            </a>
          )}
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(card.column, card.id)}
            aria-label="Xoá thẻ"
            className="shrink-0 text-subtle transition hover:text-danger"
          >
            <Trash2 size={15} strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
