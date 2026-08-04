import Link from "next/link";
import type { Product } from "@/lib/types";
import { heroImage, isFullySoldOut, lowestAvailablePrice } from "@/lib/product-helpers";
import { formatPrice, cn } from "@/lib/utils";
import BottleStage from "@/components/BottleStage";
import SoldOutStamp from "@/components/SoldOutStamp";

export default function TopShelfCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const soldOut = isFullySoldOut(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-40 shrink-0 flex-col overflow-hidden rounded-card border border-brass/25 bg-surface shadow-[0_16px_30px_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-1 sm:w-44"
    >
      <div
        className={cn(
          "relative bg-gradient-to-b from-brass/15 via-surface-raised to-surface",
          soldOut && "opacity-55 saturate-[0.15]"
        )}
      >
        <BottleStage
          src={heroImage(product)}
          alt={product.brand}
          height={196}
          inset={22}
          priority={priority}
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="-rotate-6">
              <SoldOutStamp />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-3.5 py-3">
        <span className="eyebrow text-[9px] text-brass">{product.category}</span>
        <p className="line-clamp-2 h-[2.7em] font-serif text-[15px] font-semibold leading-tight text-cream">
          {product.brand}
        </p>
        <span
          className={cn(
            "font-mono text-[15px] font-bold tabular-nums",
            soldOut ? "text-cream-faint line-through decoration-claret" : "text-cream"
          )}
        >
          {formatPrice(lowestAvailablePrice(product))}
        </span>
      </div>
    </Link>
  );
}
