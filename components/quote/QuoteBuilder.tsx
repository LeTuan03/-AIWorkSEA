"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Printer, FileText, RotateCcw, UserPlus, X } from "lucide-react";
import { CURRENCIES } from "@/lib/constants";
import { track } from "@/components/Analytics";

type Item = { id: string; label: string; unitPrice: string; quantity: string };

type Draft = {
  fromName: string;
  clientName: string;
  quoteNo: string;
  currency: string;
  items: Item[];
  taxRate: string;
  discount: string;
  notes: string;
};

const STORAGE_KEY = "aiwork-quote-draft-v1";

const PROPOSAL_TEMPLATE = `Phạm vi công việc:
- Khảo sát & chốt yêu cầu
- Xây dựng giải pháp AI/Automation theo mô tả
- Kiểm thử, bàn giao và hướng dẫn sử dụng

Thời gian dự kiến: 2-4 tuần
Thanh toán: 50% tạm ứng, 50% khi bàn giao
Báo giá có hiệu lực trong 14 ngày.`;

function newItem(): Item {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Math.round(performance.now() * 1000));
  return { id, label: "", unitPrice: "", quantity: "1" };
}

const emptyDraft = (): Draft => ({
  fromName: "",
  clientName: "",
  quoteNo: "",
  currency: "VND",
  items: [newItem()],
  taxRate: "0",
  discount: "0",
  notes: "",
});

const num = (s: string) => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

const labelCls = "mb-1 block text-sm font-medium text-fg";

export function QuoteBuilder() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);
  // Post-export nudge (GĐ1): after the PDF dialog closes, invite the
  // freelancer to create a public profile.
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    if (!showCta) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCta(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCta]);

  // Load any saved draft (guest persistence, no account needed).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Draft>;
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setDraft({ ...emptyDraft(), ...parsed, items: parsed.items as Item[] });
        }
      }
    } catch {
      /* ignore malformed draft */
    }
    setLoaded(true);
  }, []);

  // Persist after first load so we don't clobber a saved draft with the empty one.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage full / disabled */
    }
  }, [draft, loaded]);

  const set = <K extends keyof Draft>(k: K, val: Draft[K]) =>
    setDraft((d) => ({ ...d, [k]: val }));

  const updateItem = (id: string, patch: Partial<Item>) =>
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const addItem = () => setDraft((d) => ({ ...d, items: [...d.items, newItem()] }));
  const removeItem = (id: string) =>
    setDraft((d) => ({
      ...d,
      items: d.items.length > 1 ? d.items.filter((it) => it.id !== id) : d.items,
    }));

  const reset = () => setDraft(emptyDraft());

  // Totals
  const subtotal = draft.items.reduce(
    (sum, it) => sum + num(it.unitPrice) * num(it.quantity),
    0,
  );
  const discountAmt = (subtotal * num(draft.discount)) / 100;
  const taxable = subtotal - discountAmt;
  const taxAmt = (taxable * num(draft.taxRate)) / 100;
  const total = taxable + taxAmt;

  const fmt = (n: number) =>
    draft.currency === "USD"
      ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      : `${n.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ${draft.currency}`;

  const hasItems = draft.items.some((it) => it.label.trim());

  return (
    <div className="quote-grid grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ---- Editor (hidden when printing) ---- */}
      <div className="quote-noprint space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fromName" className={labelCls}>Bạn / Doanh nghiệp</label>
            <input id="fromName" className="field" value={draft.fromName}
              onChange={(e) => set("fromName", e.target.value)} placeholder="VD: Minh — AI Freelancer" maxLength={120} />
          </div>
          <div>
            <label htmlFor="clientName" className={labelCls}>Khách hàng</label>
            <input id="clientName" className="field" value={draft.clientName}
              onChange={(e) => set("clientName", e.target.value)} placeholder="VD: Công ty ABC" maxLength={120} />
          </div>
          <div>
            <label htmlFor="quoteNo" className={labelCls}>Số báo giá</label>
            <input id="quoteNo" className="field" value={draft.quoteNo}
              onChange={(e) => set("quoteNo", e.target.value)} placeholder="VD: BG-2026-001" maxLength={40} />
          </div>
          <div>
            <label htmlFor="currency" className={labelCls}>Tiền tệ</label>
            <select id="currency" className="field" value={draft.currency}
              onChange={(e) => set("currency", e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-fg">Hạng mục</span>
            <button type="button" onClick={addItem}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              <Plus size={15} strokeWidth={2} aria-hidden /> Thêm hạng mục
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {draft.items.map((it) => (
              <div key={it.id} className="rounded-xl border border-line bg-surface-2 p-3">
                <input className="field" value={it.label}
                  onChange={(e) => updateItem(it.id, { label: e.target.value })}
                  placeholder="Mô tả công việc" maxLength={200} />
                <div className="mt-2 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-muted">Đơn giá</label>
                    <input className="field" type="number" min="0" inputMode="decimal" value={it.unitPrice}
                      onChange={(e) => updateItem(it.id, { unitPrice: e.target.value })} placeholder="0" />
                  </div>
                  <div className="w-20">
                    <label className="mb-1 block text-xs text-muted">SL</label>
                    <input className="field" type="number" min="0" value={it.quantity}
                      onChange={(e) => updateItem(it.id, { quantity: e.target.value })} placeholder="1" />
                  </div>
                  <button type="button" onClick={() => removeItem(it.id)} aria-label="Xoá hạng mục"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong text-danger transition hover:bg-danger-weak">
                    <Trash2 size={16} strokeWidth={1.75} aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="discount" className={labelCls}>Chiết khấu (%)</label>
            <input id="discount" className="field" type="number" min="0" max="100" value={draft.discount}
              onChange={(e) => set("discount", e.target.value)} />
          </div>
          <div>
            <label htmlFor="taxRate" className={labelCls}>Thuế VAT (%)</label>
            <input id="taxRate" className="field" type="number" min="0" max="100" value={draft.taxRate}
              onChange={(e) => set("taxRate", e.target.value)} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="notes" className={labelCls}>Ghi chú / Điều khoản</label>
            <button type="button" onClick={() => set("notes", PROPOSAL_TEMPLATE)}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
              <FileText size={13} strokeWidth={1.75} aria-hidden /> Chèn mẫu proposal AI
            </button>
          </div>
          <textarea id="notes" className="field" rows={5} value={draft.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Phạm vi, thời gian, điều khoản thanh toán…" maxLength={2000} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              track("quote_tool_used");
              window.print();
              setShowCta(true);
            }}
            className="btn btn-primary"
          >
            <Printer size={16} strokeWidth={1.75} aria-hidden /> In / Lưu PDF
          </button>
          <button type="button" onClick={reset} className="btn btn-secondary">
            <RotateCcw size={16} strokeWidth={1.75} aria-hidden /> Làm mới
          </button>
        </div>
        <p className="text-xs text-subtle">
          Bản nháp được lưu tự động trên trình duyệt của bạn. Bấm “In / Lưu PDF” rồi
          chọn “Lưu dưới dạng PDF” trong hộp thoại in.
        </p>
      </div>

      {/* ---- Live preview = the printable document ---- */}
      <div className="quote-doc rounded-2xl glass p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="font-display text-xl font-bold text-fg">BÁO GIÁ</div>
            {draft.quoteNo && <div className="mt-1 text-sm text-muted">Số: {draft.quoteNo}</div>}
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold text-fg">{draft.fromName || "Tên của bạn"}</div>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-4 text-sm">
          <span className="text-muted">Gửi tới: </span>
          <span className="font-semibold text-fg">{draft.clientName || "Khách hàng"}</span>
        </div>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase text-subtle">
              <th className="py-2 font-medium">Hạng mục</th>
              <th className="py-2 text-right font-medium">Đơn giá</th>
              <th className="py-2 text-right font-medium">SL</th>
              <th className="py-2 text-right font-medium">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {draft.items.filter((it) => it.label.trim() || num(it.unitPrice)).map((it) => (
              <tr key={it.id} className="border-b border-line/60">
                <td className="py-2 pr-2 text-fg">{it.label || "—"}</td>
                <td className="py-2 text-right text-muted">{fmt(num(it.unitPrice))}</td>
                <td className="py-2 text-right text-muted">{num(it.quantity)}</td>
                <td className="py-2 text-right font-medium text-fg">
                  {fmt(num(it.unitPrice) * num(it.quantity))}
                </td>
              </tr>
            ))}
            {!hasItems && (
              <tr><td colSpan={4} className="py-6 text-center text-subtle">Chưa có hạng mục</td></tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
          <Row label="Tạm tính" value={fmt(subtotal)} />
          {num(draft.discount) > 0 && <Row label={`Chiết khấu (${draft.discount}%)`} value={`- ${fmt(discountAmt)}`} />}
          {num(draft.taxRate) > 0 && <Row label={`VAT (${draft.taxRate}%)`} value={fmt(taxAmt)} />}
          <div className="flex items-center justify-between border-t border-line pt-2">
            <span className="font-display font-bold text-fg">Tổng cộng</span>
            <span className="font-display text-lg font-bold text-accent">{fmt(total)}</span>
          </div>
        </div>

        {draft.notes && (
          <div className="mt-6 border-t border-line pt-4 text-sm">
            <div className="mb-1 font-semibold text-fg">Ghi chú</div>
            <div className="whitespace-pre-wrap text-muted">{draft.notes}</div>
          </div>
        )}

        <div className="mt-8 border-t border-line pt-3 text-center text-xs text-subtle">
          Tạo bởi AIWORK SEA · AIWORKSEA
        </div>
      </div>

      {/* Post-export CTA (GĐ1): quote users are exactly the freelancers we
          want in the directory. Shown once per export, easy to dismiss. */}
      {showCta && (
        <div
          className="quote-noprint fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Tạo hồ sơ freelancer miễn phí"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCta(false);
          }}
        >
          <div className="animate-float-in glass-modal relative w-full max-w-[440px] p-7">
            <button
              type="button"
              onClick={() => setShowCta(false)}
              aria-label="Đóng"
              className="absolute right-4 top-4 text-subtle transition hover:text-fg"
            >
              <X size={18} strokeWidth={2} aria-hidden />
            </button>
            <h3 className="font-display text-lg font-semibold text-fg">
              Báo giá đã sẵn sàng. Còn khách hàng tiếp theo?
            </h3>
            <p className="mt-2 text-sm text-muted">
              Tạo hồ sơ freelancer miễn phí trong 2 phút để nhà tuyển dụng AI
              &amp; Automation chủ động tìm thấy và liên hệ với bạn.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCta(false)}
                className="btn btn-secondary"
              >
                Để sau
              </button>
              <Link href="/freelancer/edit" className="btn btn-primary">
                <UserPlus size={16} strokeWidth={2} aria-hidden />
                Tạo hồ sơ miễn phí
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  );
}
