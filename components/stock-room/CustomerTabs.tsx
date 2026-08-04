"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Check, RotateCcw, Info } from "lucide-react";
import { useCustomerTabs } from "@/lib/use-customer-tabs";
import type { TabStatus } from "@/lib/use-customer-tabs";
import { formatPrice, cn } from "@/lib/utils";

type Filter = "all" | "open" | "paid";

export default function CustomerTabs() {
  const { tabs, addTab, updateTab, removeTab } = useCustomerTabs();
  const [filter, setFilter] = useState<Filter>("open");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const visible = useMemo(
    () => tabs.filter((t) => filter === "all" || t.status === filter),
    [tabs, filter]
  );

  const totalOpen = useMemo(
    () => tabs.filter((t) => t.status === "open").reduce((sum, t) => sum + t.amount, 0),
    [tabs]
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedAmount = Number(amount);
    if (!trimmedName || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    addTab({
      name: trimmedName,
      amount: parsedAmount,
      note: note.trim(),
      status: "open",
    });
    setName("");
    setAmount("");
    setNote("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-2.5 rounded-xl border border-brass/35 bg-brass/10 px-3.5 py-3">
        <Info size={14} className="mt-0.5 shrink-0 text-brass" strokeWidth={2.25} />
        <p className="text-[12px] leading-relaxed text-cream-muted">
          Customer Tabs are saved to this browser only (local demo storage) — great for
          keeping track today, but not yet shared across devices.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard label="Open balance" value={formatPrice(totalOpen)} tone="brass" />
        <SummaryCard label="Open tabs" value={String(tabs.filter((t) => t.status === "open").length)} />
        <SummaryCard
          label="Paid tabs"
          value={String(tabs.filter((t) => t.status === "paid").length)}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-2xl border border-hairline/70 bg-surface p-4"
      >
        <p className="eyebrow text-[9px] text-cream-faint">Add a tab</p>
        <div className="grid gap-3 sm:grid-cols-[1.3fr_0.8fr]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-3 text-[14px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
          />
          <div className="flex items-center gap-1 rounded-xl border border-hairline bg-surface-raised px-3.5 py-3 focus-within:border-brass/60">
            <span className="font-mono text-sm font-bold text-brass">$</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              inputMode="decimal"
              className="w-full bg-transparent font-mono text-[14px] text-cream placeholder:text-cream-faint focus:outline-none"
            />
          </div>
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional) — e.g. “two cases Corona, pay Friday”"
          className="rounded-xl border border-hairline bg-surface-raised px-3.5 py-3 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
        />
        <button
          type="submit"
          className="eyebrow flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-b from-brass to-brass-soft px-5 py-2.5 text-[11px] text-ink"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add tab
        </button>
      </form>

      <div className="flex items-center gap-2">
        {(["open", "paid", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
              filter === f
                ? "border-brass bg-brass text-ink"
                : "border-hairline bg-surface text-cream-muted"
            )}
          >
            {f === "all" ? "All" : f === "open" ? "Open" : "Paid"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {visible.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-cream-muted">
            {tabs.length === 0 ? "No customer tabs yet." : "Nothing matches that filter."}
          </p>
        ) : (
          visible.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "flex items-start justify-between gap-3 rounded-2xl border bg-surface p-4",
                tab.status === "open" ? "border-brass/35" : "border-hairline/50"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-[15px] font-semibold text-cream">{tab.name}</p>
                  <StatusBadge status={tab.status} />
                </div>
                {tab.note && (
                  <p className="mt-1 text-[12.5px] text-cream-muted">{tab.note}</p>
                )}
                <p className="mt-1.5 text-[11px] text-cream-faint">
                  {new Date(tab.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={cn(
                    "font-mono text-lg font-bold tabular-nums",
                    tab.status === "paid" ? "text-cream-faint line-through" : "text-cream"
                  )}
                >
                  {formatPrice(tab.amount)}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      updateTab(tab.id, { status: tab.status === "open" ? "paid" : "open" })
                    }
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      tab.status === "open" ? "bg-brass text-ink" : "bg-surface-raised text-cream-muted"
                    )}
                    aria-label={tab.status === "open" ? "Mark paid" : "Mark open"}
                  >
                    {tab.status === "open" ? (
                      <Check size={13} strokeWidth={2.5} />
                    ) : (
                      <RotateCcw size={12} strokeWidth={2.5} />
                    )}
                  </button>
                  <button
                    onClick={() => removeTab(tab.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-cream-faint transition-colors hover:bg-claret/20 hover:text-claret"
                    aria-label="Delete tab"
                  >
                    <Trash2 size={13} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TabStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        status === "open" ? "bg-brass/15 text-brass" : "bg-hairline/40 text-cream-faint"
      )}
    >
      {status === "open" ? "Open" : "Paid"}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  className,
}: {
  label: string;
  value: string;
  tone?: "brass";
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-hairline/60 bg-surface p-4", className)}>
      <p className="eyebrow text-[9px] text-cream-faint">{label}</p>
      <p
        className={cn(
          "mt-1.5 font-mono text-xl font-bold",
          tone === "brass" ? "text-brass" : "text-cream"
        )}
      >
        {value}
      </p>
    </div>
  );
}
