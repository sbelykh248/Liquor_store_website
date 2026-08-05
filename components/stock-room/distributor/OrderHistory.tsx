"use client";

import { useMemo, useState } from "react";
import { Search, X, Pencil, Copy, Trash2, CalendarClock, Package } from "lucide-react";
import { DISTRIBUTORS, ORDER_STATUS_META } from "@/lib/distributors/types";
import type { DistributorOrder } from "@/lib/distributors/types";
import { useDistributorOrders } from "@/lib/distributors/use-distributor-orders";
import { usePersistentState } from "@/lib/use-persistent-state";
import { cn } from "@/lib/utils";
import OrderForm from "./OrderForm";

type DistributorFilter = "all" | string;
type StatusFilter = "all" | DistributorOrder["status"];

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function OrderHistory() {
  const { orders, isReady, addOrder, updateOrder, removeOrder, duplicateOrder } = useDistributorOrders();
  const [query, setQuery] = usePersistentState("juniors:orders-search:v1", "");
  const [distributorFilter, setDistributorFilter] = usePersistentState<DistributorFilter>(
    "juniors:orders-distributor-filter:v1",
    "all"
  );
  const [statusFilter, setStatusFilter] = usePersistentState<StatusFilter>(
    "juniors:orders-status-filter:v1",
    "all"
  );
  const [showNewForm, setShowNewForm] = useState(false);
  const [editing, setEditing] = useState<DistributorOrder | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => distributorFilter === "all" || o.distributorId === distributorFilter)
      .filter((o) => statusFilter === "all" || o.status === statusFilter)
      .filter((o) => {
        if (!q) return true;
        const haystack = [
          o.distributorName,
          o.notes,
          ...o.items.map((i) => i.name),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, query, distributorFilter, statusFilter]);

  if (!isReady) {
    return <div className="h-40 animate-pulse rounded-2xl border border-hairline/40 bg-surface/60" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-[9px] text-cream-faint">Order history ({orders.length})</p>
        <button
          onClick={() => setShowNewForm(true)}
          className="eyebrow rounded-full bg-gradient-to-b from-brass to-brass-soft px-4 py-2 text-[10.5px] text-ink"
        >
          + Record order
        </button>
      </div>

      <div className="flex items-center gap-2.5 rounded-chip border border-hairline bg-surface px-3.5 py-3 focus-within:border-brass/70">
        <Search size={14} className="shrink-0 text-brass" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders, items, notes…"
          className="w-full bg-transparent text-[14px] text-cream placeholder:text-cream-faint focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear">
            <X size={14} className="text-cream-faint" />
          </button>
        )}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <FilterPill active={distributorFilter === "all"} onClick={() => setDistributorFilter("all")}>
          All distributors
        </FilterPill>
        {DISTRIBUTORS.map((d) => (
          <FilterPill
            key={d.id}
            active={distributorFilter === d.id}
            onClick={() => setDistributorFilter(d.id)}
          >
            {d.name}
          </FilterPill>
        ))}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <FilterPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
          All statuses
        </FilterPill>
        {(Object.keys(ORDER_STATUS_META) as DistributorOrder["status"][]).map((s) => (
          <FilterPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
            {ORDER_STATUS_META[s].label}
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <Package size={24} className="text-brass" strokeWidth={1.5} />
            <p className="text-[13px] text-cream-muted">
              {orders.length === 0
                ? "No orders recorded yet."
                : "No orders match your search or filters."}
            </p>
            {orders.length === 0 && (
              <p className="max-w-xs text-[11.5px] text-cream-faint">
                Place your order through a distributor portal above, then record it here to keep a
                permanent history.
              </p>
            )}
          </div>
        ) : (
          visible.map((order) => {
            const meta = ORDER_STATUS_META[order.status];
            const isConfirming = confirmingDeleteId === order.id;
            return (
              <div key={order.id} className="rounded-2xl border border-hairline/60 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-[14.5px] font-semibold text-cream">
                        {order.distributorName}
                      </p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide", meta.tone)}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-cream-faint">
                      <CalendarClock size={11} />
                      Ordered {formatDate(order.orderDate)}
                      {order.expectedDelivery && ` · Expected ${formatDate(order.expectedDelivery)}`}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => duplicateOrder(order.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-cream-faint transition-colors hover:bg-surface-raised hover:text-cream"
                      aria-label="Duplicate order"
                      title="Duplicate for a new order"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => setEditing(order)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-cream-faint transition-colors hover:bg-surface-raised hover:text-cream"
                      aria-label="Edit order"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(order.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-cream-faint transition-colors hover:bg-claret/20 hover:text-claret"
                      aria-label="Delete order"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-1 border-t border-hairline/40 pt-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[12.5px]">
                      <span className="text-cream-muted">{item.name}</span>
                      <span className="font-mono text-cream-faint">{item.quantity}</span>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <p className="mt-2.5 text-[11.5px] italic text-cream-faint">{order.notes}</p>
                )}

                {isConfirming && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-claret/45 bg-claret/10 px-3.5 py-2.5">
                    <p className="text-[11.5px] text-cream">Delete this order?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmingDeleteId(null)}
                        className="rounded-full px-3 py-1 text-[10.5px] font-semibold text-cream-muted"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          removeOrder(order.id);
                          setConfirmingDeleteId(null);
                        }}
                        className="rounded-full bg-claret px-3 py-1 text-[10.5px] font-semibold text-cream"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showNewForm && (
        <OrderForm
          onSubmit={(input) => {
            addOrder(input);
            setShowNewForm(false);
          }}
          onClose={() => setShowNewForm(false)}
        />
      )}

      {editing && (
        <OrderForm
          order={editing}
          onSubmit={(input) => {
            updateOrder(editing.id, input);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors",
        active ? "border-brass bg-brass text-ink" : "border-hairline bg-surface text-cream-muted"
      )}
    >
      {children}
    </button>
  );
}
