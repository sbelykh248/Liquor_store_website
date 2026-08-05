"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { DISTRIBUTORS, ORDER_STATUSES, ORDER_STATUS_META } from "@/lib/distributors/types";
import type { DistributorOrder, OrderStatus } from "@/lib/distributors/types";
import type { NewOrderInput } from "@/lib/distributors/use-distributor-orders";
import { cn } from "@/lib/utils";

type DraftItem = { key: string; name: string; quantity: string };

function toDraftItems(items: { name: string; quantity: string }[]): DraftItem[] {
  if (items.length === 0) return [{ key: "row-0", name: "", quantity: "" }];
  return items.map((i, idx) => ({ key: `row-${idx}`, name: i.name, quantity: i.quantity }));
}

export default function OrderForm({
  order,
  onSubmit,
  onClose,
}: {
  /** Pass an existing order to edit it in place; omit to create a new one. */
  order?: DistributorOrder;
  onSubmit: (input: NewOrderInput) => void;
  onClose: () => void;
}) {
  const [distributorId, setDistributorId] = useState(order?.distributorId ?? DISTRIBUTORS[0].id);
  const [orderDate, setOrderDate] = useState(order?.orderDate ?? new Date().toISOString().slice(0, 10));
  const [expectedDelivery, setExpectedDelivery] = useState(order?.expectedDelivery ?? "");
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? "ordered");
  const [items, setItems] = useState<DraftItem[]>(toDraftItems(order?.items ?? []));
  const [notes, setNotes] = useState(order?.notes ?? "");

  const validItems = items.filter((i) => i.name.trim().length > 0);
  const canSubmit = validItems.length > 0;

  function updateItem(key: string, patch: Partial<DraftItem>) {
    setItems((current) => current.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }

  function addItemRow() {
    setItems((current) => [...current, { key: `row-${Date.now()}`, name: "", quantity: "" }]);
  }

  function removeItemRow(key: string) {
    setItems((current) => (current.length > 1 ? current.filter((i) => i.key !== key) : current));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const distributor = DISTRIBUTORS.find((d) => d.id === distributorId) ?? DISTRIBUTORS[0];
    onSubmit({
      distributorId: distributor.id,
      distributorName: distributor.name,
      orderDate,
      expectedDelivery,
      status,
      items: validItems.map((i) => ({ name: i.name.trim(), quantity: i.quantity.trim() || "—" })),
      notes,
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-hairline bg-ink sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-hairline/60 px-5 py-4">
          <p className="font-serif text-base font-bold text-cream">
            {order ? "Edit order" : "Record an order"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream-muted hover:bg-surface"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-2 gap-2.5">
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow text-[9px] text-cream-faint">Distributor</span>
              <select
                value={distributorId}
                onChange={(e) => setDistributorId(e.target.value)}
                className="rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[13.5px] text-cream focus:border-brass/60 focus:outline-none"
              >
                {DISTRIBUTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow text-[9px] text-cream-faint">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[13.5px] text-cream focus:border-brass/60 focus:outline-none"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow text-[9px] text-cream-faint">Order date</span>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[13.5px] text-cream focus:border-brass/60 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow text-[9px] text-cream-faint">Expected delivery</span>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[13.5px] text-cream focus:border-brass/60 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="eyebrow text-[9px] text-cream-faint">Items ordered</span>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1 text-[11px] font-semibold text-brass"
              >
                <Plus size={12} />
                Add item
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.key} className="flex gap-2">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.key, { name: e.target.value })}
                    placeholder="Item name"
                    className="min-w-0 flex-1 rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
                  />
                  <input
                    value={item.quantity}
                    onChange={(e) => updateItem(item.key, { quantity: e.target.value })}
                    placeholder="Qty"
                    className="w-24 rounded-xl border border-hairline bg-surface px-3 py-2.5 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(item.key)}
                    disabled={items.length === 1}
                    className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl text-cream-faint transition-colors hover:bg-claret/15 hover:text-claret disabled:opacity-30"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="mt-4 flex flex-col gap-1.5">
            <span className="eyebrow text-[9px] text-cream-faint">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Called in a rush order, confirm case count on delivery"
              className="resize-none rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
            />
          </label>
        </div>

        <div className="border-t border-hairline/60 px-5 py-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "eyebrow flex w-full items-center justify-center rounded-2xl py-4 text-[12px] text-ink transition-opacity",
              "bg-gradient-to-b from-brass to-brass-soft",
              !canSubmit && "opacity-40"
            )}
          >
            {order ? "Save changes" : "Save order"}
          </button>
        </div>
      </form>
    </div>
  );
}
