"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import type { CategoryId } from "@/lib/types";
import type { CustomInventoryItem, NewCustomInventoryItemInput } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const EDITABLE_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");

export default function CustomItemForm({
  item,
  onSubmit,
  onDelete,
  onClose,
}: {
  /** Pass an existing item to edit it in place; omit to add a new one. */
  item?: CustomInventoryItem;
  onSubmit: (input: NewCustomInventoryItemInput) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [brand, setBrand] = useState(item?.brand ?? "");
  const [productName, setProductName] = useState(item?.productName ?? "");
  const [category, setCategory] = useState<Exclude<CategoryId, "all">>(item?.category ?? "wine");
  const [size, setSize] = useState(item?.size ?? "750ml");
  const [quantity, setQuantity] = useState(item ? String(item.quantity) : "1");
  const [cost, setCost] = useState(item ? String(item.cost) : "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const canSubmit = brand.trim().length > 0 && Number(price) > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      brand: brand.trim(),
      productName: productName.trim(),
      category,
      size: size.trim() || "750ml",
      quantity: Number(quantity) || 0,
      cost: Number(cost) || 0,
      price: Number(price),
      notes: notes.trim(),
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
            {item ? "Edit item" : "Add inventory item"}
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
            <Field label="Brand">
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Josh Cellars"
                autoFocus
                className={inputClass}
              />
            </Field>
            <Field label="Product name">
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Cabernet Sauvignon"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<CategoryId, "all">)}
                className={inputClass}
              >
                {EDITABLE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Bottle size">
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 750ml"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            <Field label="Quantity">
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                placeholder="0"
                className={inputClass}
              />
            </Field>
            <Field label="Cost">
              <MoneyInput value={cost} onChange={setCost} />
            </Field>
            <Field label="Retail price">
              <MoneyInput value={price} onChange={setPrice} />
            </Field>
          </div>

          <div className="mt-2.5">
            <Field label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Optional — shelf location, case pack, supplier, etc."
                className={cn(inputClass, "resize-none")}
              />
            </Field>
          </div>

          {onDelete && (
            <div className="mt-6 border-t border-hairline/40 pt-4">
              {confirmingDelete ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-claret/45 bg-claret/10 px-3.5 py-3">
                  <p className="text-[12px] text-cream">Delete this item permanently?</p>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-cream-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onDelete}
                      className="rounded-full bg-claret px-3 py-1.5 text-[11px] font-semibold text-cream"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="flex items-center gap-1.5 text-[11.5px] font-medium text-cream-faint transition-colors hover:text-claret"
                >
                  <Trash2 size={12} />
                  Delete item permanently
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-hairline/60 px-5 py-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className="eyebrow flex w-full items-center justify-center rounded-2xl bg-gradient-to-b from-brass to-brass-soft py-4 text-[12px] text-ink transition-opacity disabled:opacity-40"
          >
            {item ? "Save changes" : "Add item"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-hairline bg-surface px-3.5 py-3 text-[13.5px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow text-[9px] text-cream-faint">{label}</span>
      {children}
    </label>
  );
}

function MoneyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-hairline bg-surface px-3 py-3 focus-within:border-brass/60">
      <span className="font-mono text-sm font-bold text-brass">$</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder="0.00"
        inputMode="decimal"
        className="w-full bg-transparent font-mono text-[13.5px] text-cream placeholder:text-cream-faint focus:outline-none"
      />
    </div>
  );
}
