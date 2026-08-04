"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { Product } from "@/lib/types";
import {
  heroImage,
  isFullySoldOut,
  isPartiallySoldOut,
  lowestAvailablePrice,
  soldOutVariantCount,
} from "@/lib/product-helpers";
import { formatPrice, cn } from "@/lib/utils";
import BottleStage from "@/components/BottleStage";
import SoldOutStamp from "@/components/SoldOutStamp";
import PartialStockTag from "@/components/PartialStockTag";

export default function BottleCard({
  product,
  isSaved,
  onToggleSaved,
  priority = false,
}: {
  product: Product;
  isSaved?: boolean;
  onToggleSaved?: (id: string) => void;
  priority?: boolean;
}) {
  const soldOut = isFullySoldOut(product);
  const partial = isPartiallySoldOut(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-card border border-hairline/55 bg-surface shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-brass/40 active:scale-[0.98]"
    >
      <div
        className={cn(
          "relative bg-gradient-to-b from-surface-raised to-surface transition-[filter,opacity] duration-300",
          soldOut && "opacity-55 saturate-[0.15]"
        )}
      >
        <BottleStage src={heroImage(product)} alt={product.brand} height={168} inset={16} priority={priority} />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="-rotate-6">
              <SoldOutStamp compact />
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-hairline/60" />

      <div className="flex flex-1 flex-col gap-1.5 bg-surface px-3 pb-3.5 pt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="eyebrow truncate text-[9px] text-brass">{product.category}</span>
          <span className="flex-1" />
          {partial && <PartialStockTag soldOutCount={soldOutVariantCount(product)} />}
        </div>

        <p
          className={cn(
            "line-clamp-2 h-[2.6em] font-serif text-sm font-semibold leading-tight",
            soldOut ? "text-cream-muted" : "text-cream"
          )}
        >
          {product.brand}
        </p>

        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-mono text-base font-bold tabular-nums",
              soldOut ? "text-cream-faint line-through decoration-claret" : "text-cream"
            )}
          >
            {formatPrice(lowestAvailablePrice(product))}
          </span>
          {product.variants.length > 1 && (
            <span className="text-[10px] font-medium text-cream-faint">
              · {product.variants.length} sizes
            </span>
          )}
        </div>
      </div>

      {onToggleSaved && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleSaved(product.id);
          }}
          aria-label={isSaved ? "Remove from saved" : "Save bottle"}
          className={cn(
            "absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full transition-all",
            isSaved
              ? "bg-brass text-ink opacity-100"
              : "bg-ink/50 text-cream opacity-0 backdrop-blur-sm group-hover:opacity-100 md:opacity-0"
          )}
        >
          <Bookmark size={13} fill={isSaved ? "currentColor" : "none"} strokeWidth={2.25} />
        </button>
      )}
    </Link>
  );
}
