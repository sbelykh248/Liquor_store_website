"use client";

import { useState } from "react";
import { Info, Plus, Trash2, Truck } from "lucide-react";
import {
  useDistributorOrders,
  type OrderStatus,
} from "@/lib/use-distributor-orders";
import { cn } from "@/lib/utils";

const STATUS_META: Record<OrderStatus, { label: string; tone: string }> = {
  confirmed: { label: "Confirmed", tone: "bg-brass/15 text-brass" },
  pending: { label: "Pending", tone: "bg-hairline/40 text-cream-muted" },
  backordered: { label: "Backordered", tone: "bg-claret/20 text-claret" },
  delivered: { label: "Delivered", tone: "bg-cream/15 text-cream" },
};

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "backordered", "delivered"];

export default function DistributorOrders() {
  const { distributors, addItem, updateItem, removeItem } = useDistributorOrders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-2.5 rounded-xl border border-brass/35 bg-brass/10 px-3.5 py-3">
        <Info size={14} className="mt-0.5 shrink-0 text-brass" strokeWidth={2.25} />
        <p className="text-[12px] leading-relaxed text-cream-muted">
          Demo / editable placeholders — items and statuses below are saved to this
          browser only. A real distributor catalogue feed can plug in here later.
        </p>
      </div>

      {distributors.map((distributor) => (
        <DistributorCard
          key={distributor.id}
          name={distributor.name}
          items={distributor.items}
          onAdd={(entry) => addItem(distributor.id, entry)}
          onCycleStatus={(itemId, status) => updateItem(distributor.id, itemId, { status })}
          onRemove={(itemId) => removeItem(distributor.id, itemId)}
        />
      ))}
    </div>
  );
}

function DistributorCard({
  name,
  items,
  onAdd,
  onCycleStatus,
  onRemove,
}: {
  name: string;
  items: { id: string; item: string; quantity: string; eta: string; status: OrderStatus }[];
  onAdd: (entry: { item: string; quantity: string; eta: string; status: OrderStatus }) => void;
  onCycleStatus: (itemId: string, status: OrderStatus) => void;
  onRemove: (itemId: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [eta, setEta] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!item.trim()) return;
    onAdd({
      item: item.trim(),
      quantity: quantity.trim() || "—",
      eta: eta.trim() || "TBD",
      status: "pending",
    });
    setItem("");
    setQuantity("");
    setEta("");
    setShowForm(false);
  }

  return (
    <div className="rounded-2xl border border-hairline/60 bg-surface">
      <div className="flex items-center justify-between border-b border-hairline/50 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass/15">
            <Truck size={14} className="text-brass" strokeWidth={2.25} />
          </span>
          <p className="font-serif text-[15px] font-semibold text-cream">{name}</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[11px] font-semibold text-cream-muted transition-colors hover:border-brass/50 hover:text-cream"
        >
          <Plus size={12} strokeWidth={2.5} />
          Add item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2.5 border-b border-hairline/50 p-4">
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Item name"
            autoFocus
            className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-2.5 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity (e.g. 6 cases)"
              className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-2.5 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
            />
            <input
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              placeholder="ETA (e.g. Fri, Aug 8)"
              className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-2.5 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="eyebrow self-start rounded-full bg-gradient-to-b from-brass to-brass-soft px-4 py-2 text-[10.5px] text-ink"
          >
            Add to order
          </button>
        </form>
      )}

      <div className="flex flex-col divide-y divide-hairline/40">
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-cream-muted">
            No planned orders yet.
          </p>
        ) : (
          items.map((entry) => {
            const meta = STATUS_META[entry.status];
            return (
              <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-cream">{entry.item}</p>
                  <p className="mt-0.5 text-[11.5px] text-cream-faint">
                    {entry.quantity} &middot; ETA {entry.eta}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => {
                      const idx = STATUS_ORDER.indexOf(entry.status);
                      onCycleStatus(entry.id, STATUS_ORDER[(idx + 1) % STATUS_ORDER.length]);
                    }}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wide transition-colors",
                      meta.tone
                    )}
                  >
                    {meta.label}
                  </button>
                  <button
                    onClick={() => onRemove(entry.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-cream-faint transition-colors hover:bg-claret/20 hover:text-claret"
                    aria-label="Remove item"
                  >
                    <Trash2 size={12} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
