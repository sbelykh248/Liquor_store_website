"use client";

import { useMemo, useState } from "react";
import { MapPin, Clock, Phone, Search, X, RotateCcw } from "lucide-react";
import { useInventory } from "@/lib/inventory/provider";
import { useSavedProducts } from "@/lib/use-saved-products";
import {
  availableCategories,
  countFor,
  featuredProducts,
  filterAndSort,
  soldOutCount as computeSoldOutCount,
} from "@/lib/product-helpers";
import type { CategoryId, SortOption } from "@/lib/types";
import BottleCard from "@/components/BottleCard";
import TopShelfCard from "@/components/TopShelfCard";
import CategoryRail from "@/components/CategoryRail";
import SortMenu from "@/components/SortMenu";
import StoreQuote from "@/components/StoreQuotes";

export default function ShopClient() {
  const { products } = useInventory();
  const { isSaved, toggle } = useSavedProducts();

  const [category, setCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("curated");
  const [hideSoldOut, setHideSoldOut] = useState(false);

  const categories = useMemo(() => availableCategories(products), [products]);
  const filtered = useMemo(
    () => filterAndSort(products, { category, query, sort, hideSoldOut }),
    [products, category, query, sort, hideSoldOut]
  );
  const featured = useMemo(() => featuredProducts(products), [products]);
  const soldOutTotal = useMemo(() => computeSoldOutCount(products), [products]);
  const hasActiveFilters = category !== "all" || query !== "" || sort !== "curated" || hideSoldOut;

  const clearFilters = () => {
    setCategory("all");
    setQuery("");
    setSort("curated");
    setHideSoldOut(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      {/* Masthead */}
      <section className="flex flex-col items-center pt-8 text-center sm:pt-14">
        <div className="flex items-center gap-3 text-brass/70">
          <span className="h-px w-8 bg-brass/50" />
          <span className="eyebrow text-[9px]">Est. Brooklyn</span>
          <span className="h-px w-8 bg-brass/50" />
        </div>
        <h1 className="mt-3 inline-block bg-gradient-to-b from-cream to-cream/70 bg-clip-text px-2 font-serif text-4xl font-bold leading-[1.15] tracking-wide text-transparent sm:text-6xl">
          JUNIOR&apos;S
        </h1>
        <p className="eyebrow mt-2 text-[11px] text-cream-muted">Wine &amp; Liquor</p>

        <div className="mt-6 grid w-full max-w-xl grid-cols-3 divide-x divide-hairline/70 rounded-2xl border border-hairline/60 bg-surface/70 py-3.5">
          <StoreStat icon={MapPin} top="1654 Bath Ave" bottom="Brooklyn, NY" />
          <StoreStat icon={Clock} top="Open Today" bottom="1PM – 8PM" />
          <StoreStat icon={Phone} top="718 331" bottom="6868" />
        </div>
      </section>

      <div className="mt-10 sm:mt-12">
        <StoreQuote
          line="Don't let a moments pleasure lead to a lifetime of misery"
          attribution="Junior"
        />
      </div>

      {/* Top shelf marquee */}
      {query === "" && category === "all" && featured.length > 0 && (
        <section className="mt-11">
          <div className="mb-3.5 flex items-baseline justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-cream sm:text-2xl">Top Shelf</h2>
              <p className="mt-0.5 text-xs text-cream-faint">The finest pour in each aisle</p>
            </div>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
            {featured.map((product, i) => (
              <TopShelfCard key={product.id} product={product} priority={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky filters */}
      <section className="sticky top-[57px] z-20 -mx-4 mt-9 border-y border-hairline/50 bg-ink/95 px-4 py-3.5 backdrop-blur-md sm:top-[65px] sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex gap-2.5">
          <div className="flex flex-1 items-center gap-2.5 rounded-chip border border-hairline bg-surface px-3.5 py-3 focus-within:border-brass/70">
            <Search size={15} className="shrink-0 text-brass" strokeWidth={2.25} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shelf…"
              className="w-full bg-transparent text-[14px] text-cream placeholder:text-cream-faint focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={14} className="text-cream-faint" />
              </button>
            )}
          </div>
          <SortMenu
            sortOption={sort}
            onSortChange={setSort}
            hideSoldOut={hideSoldOut}
            onHideSoldOutChange={setHideSoldOut}
            soldOutCount={soldOutTotal}
          />
        </div>
        <div className="mt-3">
          <CategoryRail
            selection={category}
            onSelect={setCategory}
            countFor={(id) => countFor(products, id)}
            availableCategories={categories}
          />
        </div>
      </section>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-3 text-center">
          <Search size={26} className="text-brass" strokeWidth={1.5} />
          <p className="font-serif text-lg font-semibold text-cream">Nothing on this shelf</p>
          <p className="text-sm text-cream-muted">
            {hideSoldOut
              ? "Everything matching is sold out. Turn off “Hide sold out” to see it."
              : "Try another category, or search a different brand."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="eyebrow mt-2 inline-flex items-center gap-1.5 rounded-full bg-brass px-4.5 py-2.5 text-[11px] text-ink"
            >
              <RotateCcw size={12} />
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <BottleCard
              key={product.id}
              product={product}
              isSaved={isSaved(product.id)}
              onToggleSaved={toggle}
              priority={i < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StoreStat({
  icon: Icon,
  top,
  bottom,
}: {
  icon: typeof MapPin;
  top: string;
  bottom: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-1">
      <Icon size={13} className="text-brass" strokeWidth={2.25} />
      <span className="text-[11px] font-semibold text-cream">{top}</span>
      <span className="text-[10px] text-cream-faint">{bottom}</span>
    </div>
  );
}
