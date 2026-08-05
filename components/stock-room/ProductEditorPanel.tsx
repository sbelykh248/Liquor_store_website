"use client";

import { useMemo, useState } from "react";
import { X, ArrowUpToLine, Check, LoaderCircle, TriangleAlert } from "lucide-react";
import type { Product, ProductOverride } from "@/lib/types";
import { useInventory } from "@/lib/inventory/provider";
import { cn } from "@/lib/utils";
import BottleStage from "@/components/BottleStage";
import { heroImage } from "@/lib/product-helpers";

interface DraftVariant {
  label: string;
  price: string;
  quantity: string;
  isSoldOut: boolean;
}

export default function ProductEditorPanel({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { getOverride, publishOverride } = useInventory();
  const existing = getOverride(product.id);

  const [wholeSoldOut, setWholeSoldOut] = useState(Boolean(existing?.soldOut));
  const [variants, setVariants] = useState<DraftVariant[]>(() =>
    product.variants.map((v) => {
      const vo = existing?.variants?.find((o) => o.label === v.label);
      return {
        label: v.label,
        price: vo?.price ? String(vo.price) : "",
        quantity: typeof vo?.quantity === "number" ? String(vo.quantity) : "",
        isSoldOut: Boolean(vo?.soldOut) || Boolean(existing?.soldOut),
      };
    })
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    if (wholeSoldOut !== Boolean(existing?.soldOut)) return true;
    return variants.some((v) => {
      const vo = existing?.variants?.find((o) => o.label === v.label);
      const existingPrice = vo?.price ? String(vo.price) : "";
      const existingQuantity = typeof vo?.quantity === "number" ? String(vo.quantity) : "";
      const existingSoldOut = Boolean(vo?.soldOut) || Boolean(existing?.soldOut);
      return (
        v.price !== existingPrice ||
        v.quantity !== existingQuantity ||
        v.isSoldOut !== existingSoldOut
      );
    });
  }, [wholeSoldOut, variants, existing]);

  function toggleWholeSoldOut(next: boolean) {
    setWholeSoldOut(next);
    if (next) {
      setVariants((vs) => vs.map((v) => ({ ...v, isSoldOut: true })));
    }
  }

  function toggleVariantSoldOut(label: string, next: boolean) {
    setVariants((vs) => {
      const updated = vs.map((v) => (v.label === label ? { ...v, isSoldOut: next } : v));
      if (!next) setWholeSoldOut(false);
      if (updated.every((v) => v.isSoldOut)) setWholeSoldOut(true);
      return updated;
    });
  }

  function setVariantPrice(label: string, price: string) {
    const filtered = price.replace(/[^0-9.]/g, "");
    setVariants((vs) => vs.map((v) => (v.label === label ? { ...v, price: filtered } : v)));
  }

  function setVariantQuantity(label: string, quantity: string) {
    const filtered = quantity.replace(/[^0-9]/g, "");
    setVariants((vs) => vs.map((v) => (v.label === label ? { ...v, quantity: filtered } : v)));
  }

  async function handlePublish() {
    setIsPublishing(true);
    setError(null);
    const override: ProductOverride = {
      soldOut: wholeSoldOut,
      variants: variants.map((v) => ({
        label: v.label,
        price: v.price ? Number(v.price) : undefined,
        quantity: v.quantity ? Number(v.quantity) : undefined,
        soldOut: v.isSoldOut,
      })),
    };
    try {
      await publishOverride(product.id, override);
      setPublished(true);
      setIsPublishing(false);
      setTimeout(onClose, 1000);
    } catch {
      setIsPublishing(false);
      setError("Couldn't publish. Check your connection and try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-hairline bg-ink sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-hairline/60 px-5 py-4">
          <p className="font-serif text-base font-bold text-cream">{product.brand}</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream-muted hover:bg-surface"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3.5">
            <div className="h-24 w-[74px] shrink-0 overflow-hidden rounded-xl bg-surface">
              <BottleStage src={heroImage(product)} alt={product.brand} height={96} inset={8} showsShelf={false} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="eyebrow text-[9px] text-brass">{product.category}</span>
              <p className="text-[12px] text-cream-faint">
                {existing?.updatedAt
                  ? `Last published ${new Date(existing.updatedAt).toLocaleString()}`
                  : "Never published — showing bundled prices"}
              </p>
            </div>
          </div>

          <label
            className={cn(
              "mt-5 flex cursor-pointer items-start gap-3.5 rounded-2xl border bg-surface p-3.5 transition-colors",
              wholeSoldOut ? "border-claret/60" : "border-hairline/70"
            )}
          >
            <input
              type="checkbox"
              checked={wholeSoldOut}
              onChange={(e) => toggleWholeSoldOut(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-claret"
            />
            <div>
              <p className="text-[14px] font-semibold text-cream">Mark whole bottle sold out</p>
              <p className="mt-0.5 text-[12px] text-cream-muted">
                Customers see a &ldquo;Sold Out&rdquo; stamp on every size.
              </p>
            </div>
          </label>

          <p className="eyebrow mb-2.5 mt-6 text-[9px] text-cream-faint">
            {product.isFlavorBased ? "Flavors" : "Sizes"}
          </p>
          <div className="flex flex-col gap-2.5">
            {variants.map((variant) => {
              const bundled = product.variants.find((v) => v.label === variant.label)?.price ?? 0;
              return (
                <div
                  key={variant.label}
                  className={cn(
                    "rounded-2xl border bg-surface p-3.5 transition-colors",
                    variant.isSoldOut ? "border-claret/45" : "border-hairline/70"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "text-[14px] font-semibold",
                        variant.isSoldOut ? "text-cream-muted" : "text-cream"
                      )}
                    >
                      {variant.label}
                    </span>
                    <div className="flex items-center gap-1 rounded-lg border border-hairline bg-surface-raised px-2.5 py-2">
                      <span className="font-mono text-sm font-bold text-brass">$</span>
                      <input
                        value={variant.price}
                        onChange={(e) => setVariantPrice(variant.label, e.target.value)}
                        placeholder={bundled.toFixed(2)}
                        inputMode="decimal"
                        className="w-16 bg-transparent text-right font-mono text-[14.5px] font-semibold text-cream placeholder:text-cream-faint focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-[11.5px] text-cream-faint">On-hand quantity</span>
                    <input
                      value={variant.quantity}
                      onChange={(e) => setVariantQuantity(variant.label, e.target.value)}
                      placeholder="—"
                      inputMode="numeric"
                      className="w-16 rounded-lg border border-hairline bg-surface-raised px-2.5 py-1.5 text-right font-mono text-[13px] text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
                    />
                  </div>
                  <label className="mt-2.5 flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variant.isSoldOut}
                      onChange={(e) => toggleVariantSoldOut(variant.label, e.target.checked)}
                      className="h-3.5 w-3.5 accent-claret"
                    />
                    <span
                      className={cn(
                        "text-[12px] font-medium",
                        variant.isSoldOut ? "text-claret" : "text-cream-muted"
                      )}
                    >
                      {variant.isSoldOut ? "Sold out" : "On the shelf"}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-claret/45 bg-claret/15 px-3.5 py-3">
              <TriangleAlert size={14} className="mt-0.5 shrink-0 text-claret" strokeWidth={2.25} />
              <p className="text-[12.5px] text-cream">{error}</p>
            </div>
          )}
        </div>

        <div className="border-t border-hairline/60 px-5 py-4">
          <button
            onClick={handlePublish}
            disabled={!hasChanges || isPublishing}
            className={cn(
              "eyebrow flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[12px] text-ink transition-opacity",
              published ? "bg-gradient-to-b from-brass/90 to-brass-soft" : "bg-gradient-to-b from-brass to-brass-soft",
              (!hasChanges || isPublishing) && !published && "opacity-40"
            )}
          >
            {isPublishing ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : published ? (
              <Check size={14} />
            ) : (
              <ArrowUpToLine size={13} />
            )}
            {isPublishing ? "Publishing" : published ? "Published" : hasChanges ? "Publish changes" : "No changes"}
          </button>
          <p className="mt-2.5 text-center text-[11px] text-cream-faint">
            Changes appear on the shelf for every visitor on their next refresh.
          </p>
        </div>
      </div>
    </div>
  );
}
