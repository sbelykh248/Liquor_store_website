import type { CategoryId } from "@/lib/types";

/**
 * A manually-entered inventory item — added by a manager through the Stock
 * Room's "Add Item" form rather than coming from the bundled catalog
 * (`lib/data/products.ts`). See `catalog-service.ts` for how this fits
 * alongside future, official data sources.
 */
export interface CustomInventoryItem {
  id: string;
  source: "manual";
  brand: string;
  productName: string;
  category: Exclude<CategoryId, "all">;
  size: string;
  quantity: number;
  cost: number;
  price: number;
  notes: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewCustomInventoryItemInput = Omit<
  CustomInventoryItem,
  "id" | "source" | "archived" | "createdAt" | "updatedAt"
>;

export function customItemTitle(item: CustomInventoryItem): string {
  return [item.brand, item.productName].filter(Boolean).join(" ").trim() || "Untitled item";
}

export function isCustomItemSoldOut(item: CustomInventoryItem): boolean {
  return item.quantity <= 0;
}
