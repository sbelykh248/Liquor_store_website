"use client";

import { useMemo, useState } from "react";
import { Search, X, RotateCcw, ChevronRight, LogOut, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useInventory } from "@/lib/inventory/provider";
import { matchesQuery, isFullySoldOut, heroImage } from "@/lib/product-helpers";
import { formatPrice, cn } from "@/lib/utils";
import BottleStage from "@/components/BottleStage";
import ProductEditorPanel from "@/components/stock-room/ProductEditorPanel";
import type { Product } from "@/lib/types";

type Filter = "all" | "inStock" | "soldOut";

export default function StockRoomDashboard() {
  const { products, manager, signOut, toggleProductSoldOut, refresh, isFirebaseConfigured } = useInventory();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  const results = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = matchesQuery(p, query);
      const soldOut = isFullySoldOut(p);
      const matchesFilter = filter === "all" || (filter === "inStock" ? !soldOut : soldOut);
      return matchesSearch && matchesFilter;
    });
  }, [products, query, filter]);

  const soldOutTotal = useMemo(() => products.filter(isFullySoldOut).length, [products]);

  async function handleToggle(product: Product) {
    setBusyId(product.id);
    await toggleProductSoldOut(product.id);
    setBusyId(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <div className="flex items-center justify-between py-5">
        <div>
          <p className="eyebrow text-[9px] text-brass">
            {isFirebaseConfigured ? "Connected to Firebase" : "Local demo mode"}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-cream sm:text-3xl">Stock Room</h1>
          {manager.email && <p className="mt-0.5 text-[12px] text-cream-faint">{manager.email}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-cream-muted transition-colors hover:border-brass/50 hover:text-cream"
            aria-label="Sync"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={signOut}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-cream-muted transition-colors hover:border-claret/60 hover:text-claret"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {!isFirebaseConfigured && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-brass/35 bg-brass/10 px-3.5 py-3">
          <SlidersHorizontal size={14} className="mt-0.5 shrink-0 text-brass" strokeWidth={2.25} />
          <p className="text-[12px] leading-relaxed text-cream-muted">
            Changes here save to this browser only. Add your <code className="text-brass">NEXT_PUBLIC_FIREBASE_*</code>{" "}
            env vars to sync price and stock across every device instantly.
          </p>
        </div>
      )}

      <div className="sticky top-[57px] z-10 -mx-4 border-y border-hairline/50 bg-ink/95 px-4 py-3.5 backdrop-blur-md sm:top-[65px] sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex items-center gap-2.5 rounded-chip border border-hairline bg-surface px-3.5 py-3 focus-within:border-brass/70">
          <Search size={14} className="shrink-0 text-brass" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a bottle…"
            className="w-full bg-transparent text-[14px] text-cream placeholder:text-cream-faint focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} className="text-cream-faint" />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {(["all", "inStock", "soldOut"] as Filter[]).map((f) => (
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
              {f === "all" ? "All" : f === "inStock" ? "In stock" : "Sold out"}
            </button>
          ))}
          <span className="flex-1" />
          <span className="font-mono text-[11px] font-bold text-claret">{soldOutTotal} out</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {results.length === 0 ? (
          <p className="py-14 text-center text-[13px] text-cream-muted">No bottles match that.</p>
        ) : (
          results.map((product) => {
            const soldOut = isFullySoldOut(product);
            const isBusy = busyId === product.id;
            return (
              <div
                key={product.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-surface p-3",
                  soldOut ? "border-claret/40" : "border-hairline/60"
                )}
              >
                <button
                  onClick={() => setEditing(product)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <div className="h-[54px] w-[42px] shrink-0 overflow-hidden rounded-lg bg-surface-raised">
                    <BottleStage
                      src={heroImage(product)}
                      alt={product.brand}
                      height={54}
                      inset={4}
                      showsShelf={false}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-sm font-semibold text-cream">{product.brand}</p>
                    <p className="mt-0.5 text-[11.5px] text-cream-faint">
                      <span className="font-mono font-bold text-brass">
                        {formatPrice(product.variants[0]?.price ?? 0)}
                      </span>
                      {" · "}
                      {product.variants.length} size{product.variants.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <ChevronRight size={15} className="shrink-0 text-cream-faint" />
                </button>

                <button
                  onClick={() => handleToggle(product)}
                  disabled={isBusy}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                    soldOut ? "bg-claret/85 text-cream" : "bg-brass text-ink"
                  )}
                  aria-label={soldOut ? `Mark ${product.brand} back in stock` : `Mark ${product.brand} sold out`}
                >
                  {isBusy ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <RotateCcw size={13} className={cn(!soldOut && "rotate-45")} />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {editing && <ProductEditorPanel product={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
