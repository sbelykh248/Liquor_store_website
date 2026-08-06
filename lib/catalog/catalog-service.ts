import type { Product } from "@/lib/types";
import { heroImage, isFullySoldOut, lowestAvailablePrice } from "@/lib/product-helpers";
import type { CustomInventoryItem } from "./types";
import { customItemTitle, isCustomItemSoldOut } from "./types";

/**
 * Catalog service
 * =================
 * A small seam between "where inventory data comes from" and "how the
 * Stock Room displays it", so a real distributor feed can be plugged in
 * later without touching the Inventory UI.
 *
 * Today there are exactly two sources, both already wired up:
 *   1. `bundled`  — the static catalog in `lib/data/products.ts`, with any
 *      live price/stock overrides applied (`lib/inventory/provider.tsx`).
 *   2. `manual`   — items a manager typed in through "Add Item"
 *      (`use-custom-items.ts`), persisted locally the same way the rest of
 *      the Stock Room is.
 *
 * `InventoryRow` is the shape the Inventory tab actually renders — both
 * sources get normalized into it by `mergeCatalog` below, which is why the
 * search box, the sold-out filter, and the grid all work identically
 * regardless of where a row came from.
 *
 * Adding a real source later (a distributor's official catalog API, an
 * approved data feed, or a one-off CSV import) means writing one function
 * that returns `InventoryRow[]` — see `CatalogProvider` — and adding it to
 * the array `mergeCatalog` is called with. No unofficial scraping or
 * reverse-engineered endpoints: only integrate a distributor here once
 * they've provided a documented, authorized way to pull data.
 */

export type CatalogSource = "bundled" | "manual" | "distributor-feed" | "csv-import";

export interface InventoryRow {
  id: string;
  source: CatalogSource;
  title: string;
  category: string;
  size: string;
  price: number;
  quantity?: number;
  cost?: number;
  isSoldOut: boolean;
  image?: string;
  notes?: string;
  /** Present when `source === "bundled"` — the original catalog product. */
  product?: Product;
  /** Present when `source === "manual"` — the original custom item record. */
  customItem?: CustomInventoryItem;
}

/**
 * Contract for any future catalog source. Implementations should be pure
 * data fetchers — parsing a CSV, calling an authorized distributor API,
 * reading an approved feed export — with no side effects and no direct
 * writes back to a distributor. `lib/inventory` and `lib/catalog` stay the
 * single place that decides what the Stock Room ends up displaying.
 *
 * No implementation of this interface exists yet. This is intentionally
 * left as a contract, not a stub with fake data, so it's obvious nothing
 * here talks to a distributor today.
 */
export interface CatalogProvider {
  id: CatalogSource;
  label: string;
  fetchRows(): Promise<InventoryRow[]>;
}

export function bundledProductToRow(product: Product): InventoryRow {
  return {
    id: `bundled:${product.id}`,
    source: "bundled",
    title: product.brand,
    category: product.category,
    size: product.variants.length > 1 ? `${product.variants.length} sizes` : product.variants[0]?.label ?? "",
    price: lowestAvailablePrice(product),
    quantity: product.variants[0]?.quantity,
    isSoldOut: isFullySoldOut(product),
    image: heroImage(product),
    product,
  };
}

export function customItemToRow(item: CustomInventoryItem): InventoryRow {
  return {
    id: `manual:${item.id}`,
    source: "manual",
    title: customItemTitle(item),
    category: item.category,
    size: item.size,
    price: item.price,
    quantity: item.quantity,
    cost: item.cost,
    isSoldOut: isCustomItemSoldOut(item),
    notes: item.notes,
    customItem: item,
  };
}

/** Combines every available source into the one list the Inventory tab renders. */
export function mergeCatalog(bundled: Product[], custom: CustomInventoryItem[]): InventoryRow[] {
  return [
    ...custom.filter((i) => !i.archived).map(customItemToRow),
    ...bundled.map(bundledProductToRow),
  ];
}
