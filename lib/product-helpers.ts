import type { CategoryId, Product, SortOption, Variant } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

/**
 * Pure helper functions mirroring the computed properties on the iOS app's
 * `Product` model (`Models/Product.swift`), so catalog logic reads the same
 * way on both platforms.
 */

export function primaryVariant(product: Product): Variant {
  return product.variants[0] ?? { label: "750ml", price: 0, image: "", note: null };
}

/** Prefer showing a size that's actually on the shelf. */
export function displayVariant(product: Product): Variant {
  return product.variants.find((v) => !v.isSoldOut) ?? primaryVariant(product);
}

export function heroImage(product: Product): string {
  return primaryVariant(product).image;
}

/** True when nothing on this product can be bought today. */
export function isFullySoldOut(product: Product): boolean {
  if (product.isSoldOut) return true;
  return product.variants.length > 0 && product.variants.every((v) => v.isSoldOut);
}

/** True when some sizes are gone but not all. */
export function isPartiallySoldOut(product: Product): boolean {
  return !isFullySoldOut(product) && product.variants.some((v) => v.isSoldOut);
}

export function soldOutVariantCount(product: Product): number {
  return product.variants.filter((v) => v.isSoldOut).length;
}

export function lowestPrice(product: Product): number {
  if (product.variants.length === 0) return 0;
  return Math.min(...product.variants.map((v) => v.price));
}

/** Cheapest size that's in stock, falling back to the cheapest overall. */
export function lowestAvailablePrice(product: Product): number {
  const inStock = product.variants.filter((v) => !v.isSoldOut).map((v) => v.price);
  if (inStock.length > 0) return Math.min(...inStock);
  return lowestPrice(product);
}

export function selectorTitle(product: Product): string {
  return product.isFlavorBased ? "Select Flavor" : "Select Size";
}

export function matchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (product.brand.toLowerCase().includes(q)) return true;
  if (product.category.toLowerCase().includes(q)) return true;
  return product.variants.some((v) => v.label.toLowerCase().includes(q));
}

/** Categories that actually have stock, in shelf order, with "Everything" first. */
export function availableCategories(products: Product[]): CategoryId[] {
  const stocked = new Set(products.map((p) => p.category));
  return CATEGORIES.filter((c) => c.id === "all" || stocked.has(c.id)).map((c) => c.id);
}

export function countFor(products: Product[], category: CategoryId): number {
  if (category === "all") return products.length;
  return products.filter((p) => p.category === category).length;
}

export function filterAndSort(
  products: Product[],
  opts: { category: CategoryId; query: string; sort: SortOption; hideSoldOut: boolean }
): Product[] {
  let result = products.filter((p) => {
    const categoryMatch = opts.category === "all" || p.category === opts.category;
    return categoryMatch && matchesQuery(p, opts.query);
  });

  if (opts.hideSoldOut) {
    result = result.filter((p) => !isFullySoldOut(p));
  }

  return sortProducts(result, opts.sort);
}

export function sortProducts(input: Product[], sort: SortOption): Product[] {
  const list = [...input];
  switch (sort) {
    case "curated":
      return list;
    case "priceLowToHigh":
      return list.sort((a, b) => lowestAvailablePrice(a) - lowestAvailablePrice(b));
    case "priceHighToLow":
      return list.sort((a, b) => lowestAvailablePrice(b) - lowestAvailablePrice(a));
    case "brandAZ":
      return list.sort((a, b) => a.brand.localeCompare(b.brand));
    case "brandZA":
      return list.sort((a, b) => b.brand.localeCompare(a.brand));
    case "availability":
      return list.sort((a, b) => {
        const aOut = isFullySoldOut(a);
        const bOut = isFullySoldOut(b);
        if (aOut !== bOut) return aOut ? 1 : -1;
        const aPartial = isPartiallySoldOut(a);
        const bPartial = isPartiallySoldOut(b);
        if (aPartial !== bPartial) return aPartial ? 1 : -1;
        return a.brand.localeCompare(b.brand);
      });
    default:
      return list;
  }
}

export function soldOutCount(products: Product[]): number {
  return products.filter(isFullySoldOut).length;
}

/** Hand-picked shelf highlights for the home marquee: the priciest in-stock bottle in a few key categories. */
export function featuredProducts(products: Product[]): Product[] {
  const keys: Product["category"][] = ["whiskey", "tequila", "cognac", "wine", "champagne"];
  return keys
    .map((key) => {
      const inCategory = products.filter((p) => p.category === key);
      const available = inCategory.filter((p) => !isFullySoldOut(p));
      const pool = available.length > 0 ? available : inCategory;
      if (pool.length === 0) return null;
      return pool.reduce((best, p) => (lowestPrice(p) > lowestPrice(best) ? p : best));
    })
    .filter((p): p is Product => p !== null);
}
