/**
 * Small, defensive localStorage helpers shared by every persisted feature
 * (customer ledger, distributor orders, custom inventory items, saved
 * bottles, UI preferences).
 *
 * Every read is wrapped so a corrupted, hand-edited, or storage-quota
 * error never crashes the app — it just falls back to the caller's
 * default and the feature keeps working for the rest of the session.
 * Callers can pass an `isValid` guard to reject data that parses fine as
 * JSON but doesn't match the shape they expect (e.g. an old schema),
 * which is what keeps a future data-model change from resurrecting
 * garbage records instead of just starting clean.
 */

export function readJSON<T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T
): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (isValid && !isValid(parsed)) {
      console.warn(`[storage] Ignoring invalid data for "${key}" — resetting to default.`);
      return fallback;
    }
    return parsed as T;
  } catch (error) {
    console.warn(`[storage] Couldn't read "${key}" — resetting to default.`, error);
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] Couldn't persist "${key}" (quota exceeded or storage unavailable).`, error);
    return false;
  }
}

export function isArrayOf<T>(value: unknown, itemGuard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}
