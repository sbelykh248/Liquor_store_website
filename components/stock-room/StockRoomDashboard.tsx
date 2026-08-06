"use client";

import { useMemo, useState } from "react";
import { Search, X, RotateCcw, ChevronRight, RefreshCw, Plus, Tag } from "lucide-react";
import { useInventory } from "@/lib/inventory/provider";
import { usePersistentState } from "@/lib/use-persistent-state";
import { useCustomItems } from "@/lib/catalog/use-custom-items";
import { mergeCatalog } from "@/lib/catalog/catalog-service";
import type { InventoryRow } from "@/lib/catalog/catalog-service";
import { formatPrice, cn } from "@/lib/utils";
import BottleStage from "@/components/BottleStage";
import ProductEditorPanel from "@/components/stock-room/ProductEditorPanel";
import CustomItemForm from "@/components/stock-room/inventory/CustomItemForm";
import type { Product } from "@/lib/types";
import type { CustomInventoryItem, NewCustomInventoryItemInput } from "@/lib/catalog/types";

type Filter = "all" | "inStock" | "soldOut";

export default function StockRoomDashboard() {
  const { products, toggleProductSoldOut } = useInventory();
  const { items: customItems, isReady: customItemsReady, addItem, updateItem, toggleSoldOut, removeItem } =
    useCustomItems();

  const [query, setQuery] = usePersistentState("juniors:stock-room-search:v1", "");
  const [filter, setFilter] = usePersistentState<Filter>("juniors:stock-room-filter:v1", "all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCustomItem, setEditingCustomItem] = useState<CustomInventoryItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const rows = useMemo(() => mergeCatalog(products, customItems), [products, customItems]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !q || row.title.toLowerCase().includes(q) || row.category.toLowerCase().includes(q);
      const matchesFilter =
        filter === "all" || (filter === "inStock" ? !row.isSoldOut : row.isSoldOut);
      return matchesSearch && matchesFilter;
    });
  }, [rows, query, filter]);

  const soldOutTotal = useMemo(() => rows.filter((r) => r.isSoldOut).length, [rows]);

  async function handleToggle(row: InventoryRow) {
    setBusyId(row.id);
    if (row.source === "manual" && row.customItem) {
      toggleSoldOut(row.customItem.id);
    } else if (row.product) {
      await toggleProductSoldOut(row.product.id);
    }
    setBusyId(null);
  }

  function handleRowClick(row: InventoryRow) {
    if (row.source === "manual" && row.customItem) {
      setEditingCustomItem(row.customItem);
    } else if (row.product) {
      setEditingProduct(row.product);
    }
  }

  function handleAddItem(input: NewCustomInventoryItemInput) {
    addItem(input);
    setShowAddItem(false);
  }

  const isLoading = !customItemsReady;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-[9px] text-cream-faint">{rows.length} items on file</p>
        <button
          onClick={() => setShowAddItem(true)}
          className="eyebrow flex items-center gap-1.5 rounded-full bg-gradient-to-b from-brass to-brass-soft px-4 py-2 text-[10.5px] text-ink"
        >
          <Plus size={12} strokeWidth={2.5} />
          Add item
        </button>
      </div>

      <div className="rounded-2xl border border-hairline/60 bg-surface/40 p-3.5">
        <div className="flex items-center gap-2.5 rounded-chip border border-hairline bg-surface px-3.5 py-3 focus-within:border-brass/70">
          <Search size={14} className="shrink-0 text-brass" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a bottle or item…"
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

      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <RowsSkeleton />
        ) : results.length === 0 ? (
          <p className="py-14 text-center text-[13px] text-cream-muted">
            {rows.length === 0 ? "No inventory yet — add your first item above." : "No bottles match that."}
          </p>
        ) : (
          results.map((row) => {
            const isBusy = busyId === row.id;
            return (
              <div
                key={row.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-surface p-3",
                  row.isSoldOut ? "border-claret/40" : "border-hairline/60"
                )}
              >
                <button
                  onClick={() => handleRowClick(row)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <div className="h-[54px] w-[42px] shrink-0 overflow-hidden rounded-lg bg-surface-raised">
                    {row.image ? (
                      <BottleStage src={row.image} alt={row.title} height={54} inset={4} showsShelf={false} />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Tag size={14} className="text-cream-faint" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate font-serif text-sm font-semibold text-cream">{row.title}</p>
                      {row.source === "manual" && (
                        <span className="shrink-0 rounded-full bg-brass/15 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-brass">
                          Added
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-cream-faint">
                      <span className="font-mono font-bold text-brass">{formatPrice(row.price)}</span>
                      {row.size && <> · {row.size}</>}
                      {typeof row.quantity === "number" && <> · Qty {row.quantity}</>}
                    </p>
                  </div>
                  <ChevronRight size={15} className="shrink-0 text-cream-faint" />
                </button>

                <button
                  onClick={() => handleToggle(row)}
                  disabled={isBusy}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                    row.isSoldOut ? "bg-claret/85 text-cream" : "bg-brass text-ink"
                  )}
                  aria-label={row.isSoldOut ? `Mark ${row.title} back in stock` : `Mark ${row.title} sold out`}
                >
                  {isBusy ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <RotateCcw size={13} className={cn(!row.isSoldOut && "rotate-45")} />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {editingProduct && (
        <ProductEditorPanel product={editingProduct} onClose={() => setEditingProduct(null)} />
      )}

      {editingCustomItem && (
        <CustomItemForm
          item={editingCustomItem}
          onSubmit={(input) => {
            updateItem(editingCustomItem.id, input);
            setEditingCustomItem(null);
          }}
          onDelete={() => {
            removeItem(editingCustomItem.id);
            setEditingCustomItem(null);
          }}
          onClose={() => setEditingCustomItem(null)}
        />
      )}

      {showAddItem && (
        <CustomItemForm onSubmit={handleAddItem} onClose={() => setShowAddItem(false)} />
      )}
    </div>
  );
}

function RowsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[78px] animate-pulse rounded-2xl border border-hairline/40 bg-surface/60" />
      ))}
    </div>
  );
}
