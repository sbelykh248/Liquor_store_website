"use client";

import { useMemo, useState } from "react";
import { Search, X, Plus, ChevronRight, Archive } from "lucide-react";
import { useCustomerLedger } from "@/lib/customer-ledger/use-customer-ledger";
import type { Customer } from "@/lib/customer-ledger/types";
import { usePersistentState } from "@/lib/use-persistent-state";
import { cn, formatPrice } from "@/lib/utils";
import CustomerDetailModal from "./CustomerDetailModal";

type View = "active" | "archived";

export default function CustomerLedgerPanel() {
  const { customers, isReady, totals, addCustomer } = useCustomerLedger();
  const [query, setQuery] = usePersistentState("juniors:ledger-search:v1", "");
  const [view, setView] = usePersistentState<View>("juniors:ledger-view:v1", "active");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers
      .filter((c) => (view === "active" ? !c.archived : c.archived))
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone?.includes(q))
      .sort((a, b) => b.balance - a.balance);
  }, [customers, view, query]);

  if (!isReady) {
    return <PanelSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Total owed" value={formatPrice(totals.totalOwed)} tone="brass" />
        <SummaryCard label="Open accounts" value={String(totals.openCount)} />
        <SummaryCard label="Settled" value={String(totals.settledCount)} />
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex flex-1 items-center gap-2.5 rounded-chip border border-hairline bg-surface px-3.5 py-3 focus-within:border-brass/70">
          <Search size={14} className="shrink-0 text-brass" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers…"
            className="w-full bg-transparent text-[14px] text-cream placeholder:text-cream-faint focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} className="text-cream-faint" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="eyebrow flex shrink-0 items-center gap-1.5 rounded-chip bg-gradient-to-b from-brass to-brass-soft px-4 py-3 text-[11px] text-ink"
        >
          <Plus size={13} strokeWidth={2.5} />
          New
        </button>
      </div>

      {showForm && (
        <NewCustomerForm
          onCreate={(input) => {
            addCustomer(input);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="flex items-center gap-2">
        {(["active", "archived"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
              view === v ? "border-brass bg-brass text-ink" : "border-hairline bg-surface text-cream-muted"
            )}
          >
            {v === "active" ? "Active" : "Archived"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {visible.length === 0 ? (
          <EmptyState
            hasAny={customers.length > 0}
            view={view}
            onNew={() => setShowForm(true)}
          />
        ) : (
          visible.map((customer) => (
            <button
              key={customer.id}
              onClick={() => setSelected(customer)}
              className="flex items-center justify-between gap-3 rounded-2xl border border-hairline/60 bg-surface p-4 text-left transition-colors hover:border-brass/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-serif text-[15px] font-semibold text-cream">
                    {customer.name}
                  </p>
                  {customer.archived && <Archive size={12} className="shrink-0 text-cream-faint" />}
                </div>
                {customer.phone && (
                  <p className="mt-0.5 text-[11.5px] text-cream-faint">{customer.phone}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <span
                  className={cn(
                    "font-mono text-base font-bold tabular-nums",
                    customer.balance > 0 ? "text-brass" : "text-cream-faint"
                  )}
                >
                  {formatPrice(customer.balance)}
                </span>
                <ChevronRight size={15} className="text-cream-faint" />
              </div>
            </button>
          ))
        )}
      </div>

      {selected && (
        <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function NewCustomerForm({
  onCreate,
  onCancel,
}: {
  onCreate: (input: { name: string; phone?: string; notes?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate({ name, phone, notes });
      }}
      className="flex flex-col gap-2.5 rounded-2xl border border-hairline/70 bg-surface p-4"
    >
      <p className="eyebrow text-[9px] text-cream-faint">New customer</p>
      <div className="grid grid-cols-2 gap-2.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer name"
          autoFocus
          className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-3 text-[14px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-3 text-[14px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
        />
      </div>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-3 text-[14px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
      />
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-[11.5px] text-cream-muted">
          Cancel
        </button>
        <button
          type="submit"
          className="eyebrow rounded-full bg-gradient-to-b from-brass to-brass-soft px-4 py-2 text-[11px] text-ink"
        >
          Create
        </button>
      </div>
    </form>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "brass";
}) {
  return (
    <div className="rounded-2xl border border-hairline/60 bg-surface p-3.5">
      <p className="eyebrow text-[8.5px] text-cream-faint">{label}</p>
      <p className={cn("mt-1.5 font-mono text-lg font-bold", tone === "brass" ? "text-brass" : "text-cream")}>
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  hasAny,
  view,
  onNew,
}: {
  hasAny: boolean;
  view: View;
  onNew: () => void;
}) {
  if (view === "archived") {
    return (
      <p className="py-14 text-center text-[13px] text-cream-muted">No archived customers.</p>
    );
  }
  if (!hasAny) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <p className="text-[13px] text-cream-muted">No customers yet.</p>
        <button
          onClick={onNew}
          className="eyebrow flex items-center gap-1.5 rounded-full bg-brass px-4 py-2.5 text-[11px] text-ink"
        >
          <Plus size={13} />
          Add your first customer
        </button>
      </div>
    );
  }
  return <p className="py-14 text-center text-[13px] text-cream-muted">No customers match that search.</p>;
}

function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[70px] animate-pulse rounded-2xl border border-hairline/40 bg-surface/60" />
        ))}
      </div>
      <div className="h-12 animate-pulse rounded-chip border border-hairline/40 bg-surface/60" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl border border-hairline/40 bg-surface/60" />
      ))}
    </div>
  );
}
