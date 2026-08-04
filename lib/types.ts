/**
 * Shared domain types for the catalog. These mirror the shapes used by the
 * companion iOS app (see `Models/Product.swift`) so the same mental model —
 * and eventually the same Firestore documents — can drive both clients.
 */

export type CategoryId =
  | "all"
  | "wine"
  | "champagne"
  | "vodka"
  | "tequila"
  | "whiskey"
  | "cognac"
  | "rum"
  | "liqueur"
  | "mixed";

export interface Variant {
  /** Bottle size ("750ml") or flavor name ("Mango Chiller"). */
  label: string;
  /** Bundled price. Replaced at runtime by a live Firestore price when one exists. */
  price: number;
  /** Path to the bottle photo, relative to /public. */
  image: string;
  /** Variant-specific tasting note, used by flavor-based products. */
  note: string | null;
  /** Set by the live inventory layer — never present in the bundled data. */
  isSoldOut?: boolean;
}

export interface Product {
  id: string;
  brand: string;
  category: Exclude<CategoryId, "all">;
  description: string;
  isFlavorBased: boolean;
  variants: Variant[];
  /** Whole-product availability override, driven by live inventory. */
  isSoldOut?: boolean;
}

export type SortOption =
  | "curated"
  | "priceLowToHigh"
  | "priceHighToLow"
  | "brandAZ"
  | "brandZA"
  | "availability";

export const SORT_OPTIONS: { id: SortOption; title: string; shortTitle: string }[] = [
  { id: "curated", title: "Shelf order", shortTitle: "Shelf" },
  { id: "priceLowToHigh", title: "Price: low to high", shortTitle: "$ Low" },
  { id: "priceHighToLow", title: "Price: high to low", shortTitle: "$ High" },
  { id: "brandAZ", title: "Name: A – Z", shortTitle: "A – Z" },
  { id: "brandZA", title: "Name: Z – A", shortTitle: "Z – A" },
  { id: "availability", title: "In stock first", shortTitle: "In stock" },
];

export interface CategoryMeta {
  id: CategoryId;
  title: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "all", title: "Everything" },
  { id: "wine", title: "Wine" },
  { id: "champagne", title: "Sparkling" },
  { id: "vodka", title: "Vodka" },
  { id: "tequila", title: "Tequila" },
  { id: "whiskey", title: "Whiskey" },
  { id: "cognac", title: "Cognac" },
  { id: "rum", title: "Rum" },
  { id: "liqueur", title: "Liqueur" },
  { id: "mixed", title: "Ready to Drink" },
];

/**
 * A per-product override as it will be stored in Firestore, e.g.
 * `products/{productId}`. Kept here so the client and the future
 * Firestore schema stay in lockstep.
 */
export interface ProductOverride {
  soldOut?: boolean;
  updatedAt?: string;
  variants?: {
    label: string;
    price?: number;
    soldOut?: boolean;
  }[];
}
