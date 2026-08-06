"use client";

import { useMemo, useState } from "react";
import {
  X,
  Pencil,
  Archive,
  ArchiveRestore,
  Plus,
  Minus,
  SlidersHorizontal,
  Eraser,
  Trash2,
} from "lucide-react";
import type { Customer, TransactionType } from "@/lib/customer-ledger/types";
import { TRANSACTION_LABEL } from "@/lib/customer-ledger/types";
import { useCustomerLedger } from "@/lib/customer-ledger/use-customer-ledger";
import { cn, formatPrice } from "@/lib/utils";

type Action = TransactionType | null;

const ACTIONS: { id: TransactionType; label: string; icon: typeof Plus }[] = [
  { id: "charge", label: "Add charge", icon: Plus },
  { id: "payment", label: "Add payment", icon: Minus },
  { id: "adjustment", label: "Adjust", icon: SlidersHorizontal },
  { id: "clear", label: "Clear balance", icon: Eraser },
];

export default function CustomerDetailModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const { customers, transactionsFor, recordTransaction, updateCustomer, setArchived, removeCustomer } =
    useCustomerLedger();

  const live = customers.find((c) => c.id === customer.id) ?? customer;
  const history = useMemo(() => transactionsFor(customer.id), [transactionsFor, customer.id]);

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [action, setAction] = useState<Action>(null);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-hairline bg-ink sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-hairline/60 px-5 py-4">
          {isEditing ? (
            <EditCustomerForm
              customer={live}
              onSave={(patch) => {
                updateCustomer(live.id, patch);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div>
                <p className="font-serif text-base font-bold text-cream">{live.name}</p>
                {live.phone && <p className="mt-0.5 text-[12px] text-cream-faint">{live.phone}</p>}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream-muted transition-colors hover:bg-surface hover:text-cream"
                  aria-label="Edit customer"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream-muted transition-colors hover:bg-surface hover:text-cream"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center justify-between rounded-2xl border border-hairline/60 bg-surface p-4">
            <div>
              <p className="eyebrow text-[9px] text-cream-faint">Current balance</p>
              <p
                className={cn(
                  "mt-1 font-mono text-2xl font-bold",
                  live.balance > 0 ? "text-brass" : "text-cream-muted"
                )}
              >
                {formatPrice(live.balance)}
              </p>
            </div>
            <button
              onClick={() => setArchived(live.id, !live.archived)}
              className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-2 text-[11px] font-semibold text-cream-muted transition-colors hover:border-brass/50 hover:text-cream"
            >
              {live.archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
              {live.archived ? "Restore" : "Archive"}
            </button>
          </div>

          {live.notes && (
            <p className="mt-3 rounded-xl border border-hairline/50 bg-surface/60 px-3.5 py-2.5 text-[12.5px] text-cream-muted">
              {live.notes}
            </p>
          )}

          <div className="mt-5 grid grid-cols-4 gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAction((current) => (current === a.id ? null : a.id))}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border py-3 text-center transition-colors",
                  action === a.id
                    ? "border-brass bg-brass text-ink"
                    : "border-hairline bg-surface text-cream-muted hover:text-cream"
                )}
              >
                <a.icon size={15} strokeWidth={2.25} />
                <span className="text-[10px] font-semibold leading-tight">{a.label}</span>
              </button>
            ))}
          </div>

          {action && (
            <TransactionForm
              customerId={live.id}
              type={action}
              currentBalance={live.balance}
              onSubmit={(input) => {
                recordTransaction(input);
                setAction(null);
              }}
              onCancel={() => setAction(null)}
            />
          )}

          <div className="mt-6">
            <p className="eyebrow mb-2.5 text-[9px] text-cream-faint">
              Transaction history ({history.length})
            </p>
            {history.length === 0 ? (
              <p className="rounded-xl border border-dashed border-hairline/60 py-8 text-center text-[12.5px] text-cream-faint">
                No transactions recorded yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-hairline/50 bg-surface/70 px-3.5 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-semibold text-cream">
                        {TRANSACTION_LABEL[t.type]}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[13px] font-bold",
                          t.amount > 0 ? "text-brass" : t.amount < 0 ? "text-cream-muted" : "text-cream-faint"
                        )}
                      >
                        {t.amount > 0 ? "+" : ""}
                        {formatPrice(t.amount)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-cream-faint">
                      <span>{new Date(t.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                      <span>Balance: {formatPrice(t.balanceAfter)}</span>
                    </div>
                    {t.products && (
                      <p className="mt-1.5 text-[12px] text-cream-muted">{t.products}</p>
                    )}
                    {t.notes && <p className="mt-1 text-[11.5px] italic text-cream-faint">{t.notes}</p>}
                    {t.employeeName && (
                      <p className="mt-1 text-[10.5px] text-cream-faint">— {t.employeeName}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-hairline/40 pt-4">
            {confirmingDelete ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-claret/45 bg-claret/10 px-3.5 py-3">
                <p className="text-[12px] text-cream">Delete this customer and all history?</p>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-cream-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      removeCustomer(live.id);
                      onClose();
                    }}
                    className="rounded-full bg-claret px-3 py-1.5 text-[11px] font-semibold text-cream"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="flex items-center gap-1.5 text-[11.5px] font-medium text-cream-faint transition-colors hover:text-claret"
              >
                <Trash2 size={12} />
                Delete customer permanently
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditCustomerForm({
  customer,
  onSave,
  onCancel,
}: {
  customer: Customer;
  onSave: (patch: { name: string; phone?: string; notes?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [notes, setNotes] = useState(customer.notes ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ name, phone, notes });
      }}
      className="flex w-full flex-col gap-2"
    >
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer name"
          autoFocus
          className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-[13px] text-cream focus:border-brass/60 focus:outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="w-40 rounded-lg border border-hairline bg-surface px-3 py-2 text-[13px] text-cream focus:border-brass/60 focus:outline-none"
        />
      </div>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-[13px] text-cream focus:border-brass/60 focus:outline-none"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full px-3 py-1.5 text-[11px] text-cream-muted">
          Cancel
        </button>
        <button type="submit" className="rounded-full bg-brass px-3.5 py-1.5 text-[11px] font-semibold text-ink">
          Save
        </button>
      </div>
    </form>
  );
}

function TransactionForm({
  customerId,
  type,
  currentBalance,
  onSubmit,
  onCancel,
}: {
  customerId: string;
  type: TransactionType;
  currentBalance: number;
  onSubmit: (input: {
    customerId: string;
    type: TransactionType;
    amount?: number;
    employeeName?: string;
    notes?: string;
    products?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [sign, setSign] = useState<"increase" | "decrease">("increase");
  const [products, setProducts] = useState("");
  const [notes, setNotes] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const parsedAmount = Number(amount);
  const canSubmit =
    type === "clear" || (Number.isFinite(parsedAmount) && parsedAmount > 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      customerId,
      type,
      amount: type === "adjustment" ? (sign === "increase" ? parsedAmount : -parsedAmount) : parsedAmount,
      employeeName: employeeName || undefined,
      notes: notes || undefined,
      products: type === "charge" ? products || undefined : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-3 rounded-2xl border border-brass/30 bg-brass/5 p-4"
    >
      {type === "clear" ? (
        <p className="text-[13px] text-cream-muted">
          This will zero out the balance (currently{" "}
          <span className="font-mono font-semibold text-cream">{formatPrice(currentBalance)}</span>)
          and record it as a single transaction.
        </p>
      ) : (
        <div className="flex items-center gap-2.5">
          {type === "adjustment" && (
            <div className="flex overflow-hidden rounded-lg border border-hairline">
              <button
                type="button"
                onClick={() => setSign("increase")}
                className={cn(
                  "px-3 py-2.5 text-[13px] font-bold",
                  sign === "increase" ? "bg-brass text-ink" : "bg-surface text-cream-muted"
                )}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setSign("decrease")}
                className={cn(
                  "px-3 py-2.5 text-[13px] font-bold",
                  sign === "decrease" ? "bg-claret text-cream" : "bg-surface text-cream-muted"
                )}
              >
                −
              </button>
            </div>
          )}
          <div className="flex flex-1 items-center gap-1 rounded-lg border border-hairline bg-surface px-3 py-2.5 focus-within:border-brass/60">
            <span className="font-mono text-sm font-bold text-brass">$</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              inputMode="decimal"
              autoFocus
              className="w-full bg-transparent font-mono text-[14px] text-cream placeholder:text-cream-faint focus:outline-none"
            />
          </div>
        </div>
      )}

      {type === "charge" && (
        <input
          value={products}
          onChange={(e) => setProducts(e.target.value)}
          placeholder="Items (optional) — e.g. 2x Josh Cabernet"
          className="rounded-lg border border-hairline bg-surface px-3 py-2.5 text-[13px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
        />
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="rounded-lg border border-hairline bg-surface px-3 py-2.5 text-[13px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
        />
        <input
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Your name (optional)"
          className="rounded-lg border border-hairline bg-surface px-3 py-2.5 text-[13px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full px-3.5 py-2 text-[11.5px] text-cream-muted">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-gradient-to-b from-brass to-brass-soft px-4 py-2 text-[11.5px] font-semibold text-ink disabled:opacity-40"
        >
          {ACTION_CONFIRM_LABEL[type]}
        </button>
      </div>
    </form>
  );
}

const ACTION_CONFIRM_LABEL: Record<TransactionType, string> = {
  charge: "Record charge",
  payment: "Record payment",
  adjustment: "Record adjustment",
  clear: "Clear balance",
};
