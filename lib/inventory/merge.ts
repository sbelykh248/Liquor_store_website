import type { Product, ProductOverride } from "@/lib/types";

/**
 * Applies live Firestore overrides on top of the bundled catalog. Mirrors
 * `ShelfModel.rebuild()` in the iOS app so both clients resolve the same
 * document shape the same way:
 *
 * - Missing override → bundled price, everything in stock.
 * - `soldOut` on the product forces every size sold out.
 * - A variant's `price`, when present and > 0, replaces the bundled price.
 * - A variant's `quantity`, when present, is passed straight through — an
 *   on-hand count the Stock Room tracks but the bundled catalog never has.
 * - Sizes not listed in the override keep their bundled price/availability.
 */
export function mergeOverrides(
  base: Product[],
  overrides: Record<string, ProductOverride>
): Product[] {
  return base.map((product) => {
    const override = overrides[product.id];
    if (!override) return product;

    const variants = product.variants.map((variant) => {
      const variantOverride = override.variants?.find((v) => v.label === variant.label);
      if (!variantOverride) {
        return { ...variant, isSoldOut: Boolean(override.soldOut) };
      }
      return {
        ...variant,
        price:
          typeof variantOverride.price === "number" && variantOverride.price > 0
            ? variantOverride.price
            : variant.price,
        isSoldOut: Boolean(override.soldOut) || Boolean(variantOverride.soldOut),
        quantity: variantOverride.quantity,
      };
    });

    return { ...product, isSoldOut: Boolean(override.soldOut), variants };
  });
}
