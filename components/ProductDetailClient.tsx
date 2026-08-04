"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, CircleAlert, CircleX, Phone } from "lucide-react";
import { useInventory } from "@/lib/inventory/provider";
import { useSavedProducts } from "@/lib/use-saved-products";
import {
  displayVariant,
  isFullySoldOut,
  isPartiallySoldOut,
  selectorTitle,
} from "@/lib/product-helpers";
import { cn, formatPrice } from "@/lib/utils";
import BottleStage from "@/components/BottleStage";
import SoldOutStamp from "@/components/SoldOutStamp";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({ productId, fallback }: { productId: string; fallback: Product }) {
  const { getProduct } = useInventory();
  const { isSaved, toggle } = useSavedProducts();
  const product = getProduct(productId) ?? fallback;

  const [selectedLabel, setSelectedLabel] = useState(displayVariant(product).label);
  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.label === selectedLabel) ?? displayVariant(product),
    [product, selectedLabel]
  );

  const soldOut = isFullySoldOut(product);
  const partial = isPartiallySoldOut(product);
  const tastingNote = selectedVariant.note ?? product.description;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-32 sm:px-6 sm:pb-16">
      <div className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface/90 text-cream transition-colors hover:border-brass/50"
          aria-label="Back to the shelf"
        >
          <ArrowLeft size={16} strokeWidth={2.25} />
        </Link>

        <div className="flex items-center gap-2">
          {soldOut && <SoldOutStamp compact />}
          <button
            onClick={() => toggle(product.id)}
            aria-label={isSaved(product.id) ? "Remove from saved" : "Save bottle"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              isSaved(product.id)
                ? "border-brass bg-brass text-ink"
                : "border-hairline bg-surface/90 text-cream hover:border-brass/50"
            )}
          >
            <Bookmark size={15} fill={isSaved(product.id) ? "currentColor" : "none"} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "relative rounded-3xl bg-[radial-gradient(circle_at_center,rgba(200,162,74,0.16),transparent_65%)]",
          selectedVariant.isSoldOut && "opacity-60 saturate-[0.2]"
        )}
      >
        <BottleStage
          key={selectedVariant.image}
          src={selectedVariant.image}
          alt={product.brand}
          height={320}
          inset={40}
          priority
        />
      </div>

      <div className="mt-2 flex flex-col gap-0.5 sm:mt-4">
        <span className="eyebrow text-[10px] text-brass">{product.category}</span>
        <h1 className="font-serif text-3xl font-bold text-cream sm:text-4xl">{product.brand}</h1>
      </div>

      {soldOut && (
        <StockNotice
          tone="claret"
          title="Out of stock"
          detail="This one's off the shelf right now. Call the shop and we'll tell you when the next case lands."
        />
      )}
      {!soldOut && partial && (
        <StockNotice
          tone="brass"
          title="Some sizes are out"
          detail="Greyed-out sizes below are sold out today."
        />
      )}

      <div className="mt-6 flex items-center gap-2">
        <span className="h-px w-6 bg-brass" />
        <span className="eyebrow text-[9px] text-cream-faint">Tasting note</span>
      </div>
      <p className="mt-2.5 text-[15px] leading-relaxed text-cream-muted">{tastingNote}</p>

      <div className="mt-8">
        <p className="eyebrow mb-3 text-[10px] text-cream-muted">{selectorTitle(product)}</p>
        <div
          className={cn(
            "grid gap-2.5",
            product.isFlavorBased
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-3 sm:grid-cols-4"
          )}
        >
          {product.variants.map((variant) => {
            const isActive = variant.label === selectedLabel;
            const isOut = Boolean(variant.isSoldOut);
            return (
              <button
                key={variant.label}
                onClick={() => setSelectedLabel(variant.label)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border py-3 text-center transition-colors",
                  isOut
                    ? "border-claret/45 bg-claret/10 text-cream-faint"
                    : isActive
                      ? "border-brass bg-brass text-ink"
                      : "border-hairline bg-surface text-cream hover:border-hairline"
                )}
              >
                <span className="text-[12.5px] font-semibold">{variant.label}</span>
                <span className="font-mono text-[11px] font-bold opacity-80">
                  {isOut ? "Sold out" : formatPrice(variant.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop reserve */}
      <div className="mt-10 hidden items-center justify-between rounded-2xl border border-hairline bg-surface/70 px-6 py-5 sm:flex">
        <PriceBlock label={selectedVariant.label} price={selectedVariant.price} soldOut={selectedVariant.isSoldOut} />
        <ReserveButton soldOut={selectedVariant.isSoldOut} />
      </div>

      {/* Mobile sticky reserve footer */}
      <div className="fixed inset-x-0 bottom-[76px] z-20 flex items-center justify-between border-t border-hairline bg-surface/90 px-4 py-3.5 backdrop-blur-md sm:hidden">
        <PriceBlock label={selectedVariant.label} price={selectedVariant.price} soldOut={selectedVariant.isSoldOut} />
        <ReserveButton soldOut={selectedVariant.isSoldOut} />
      </div>
    </div>
  );
}

function PriceBlock({ label, price, soldOut }: { label: string; price: number; soldOut?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="eyebrow text-[9px] text-cream-faint">{label}</span>
      <span
        className={cn(
          "font-mono text-2xl font-bold tabular-nums sm:text-3xl",
          soldOut ? "text-cream-muted line-through decoration-claret" : "text-cream"
        )}
      >
        {formatPrice(price)}
      </span>
    </div>
  );
}

function ReserveButton({ soldOut }: { soldOut?: boolean }) {
  return (
    <a
      href="tel:7183316868"
      className={cn(
        "eyebrow flex items-center gap-2 rounded-full px-5 py-3.5 text-[12px]",
        soldOut ? "bg-claret/85 text-cream" : "bg-gradient-to-b from-brass to-brass-soft text-ink"
      )}
    >
      <Phone size={13} strokeWidth={2.5} />
      {soldOut ? "Ask us" : "Reserve"}
    </a>
  );
}

function StockNotice({
  tone,
  title,
  detail,
}: {
  tone: "claret" | "brass";
  title: string;
  detail: string;
}) {
  const Icon = tone === "claret" ? CircleX : CircleAlert;
  return (
    <div
      className={cn(
        "mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5",
        tone === "claret" ? "border-claret/40 bg-claret/10" : "border-brass/40 bg-brass/10"
      )}
    >
      <Icon size={16} className={tone === "claret" ? "text-claret" : "text-brass"} strokeWidth={2.25} />
      <div>
        <p className="text-[13.5px] font-bold text-cream">{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-cream-muted">{detail}</p>
      </div>
    </div>
  );
}
