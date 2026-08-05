"use client";

import { useCallback, useEffect, useState } from "react";

type SetPersistentState<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Drop-in replacement for `useState` that mirrors the value to `localStorage`,
 * so UI state — the active Stock Room tab, filters, sort order, search text,
 * and similar preferences — survives a refresh or reopening the browser.
 *
 * Starts from `defaultValue` on both the server and the first client render
 * (so there's no hydration mismatch), then swaps in the saved value right
 * after mount if one exists. Storage writes only happen when the setter
 * returned here is called — never as a side effect of the initial load —
 * so there's no race where a fresh mount's default value clobbers what was
 * just read from storage (which is exactly what a naive "save on every
 * value change" effect would do, since React runs a component's effects in
 * one batch before any state update they scheduled has been applied).
 */
export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValueRaw] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValueRaw(JSON.parse(raw) as T);
      }
    } catch {
      // Ignore malformed/unavailable storage — default value stands.
    }
    // Intentionally re-reads if `key` changes; `defaultValue` identity is
    // not tracked so callers can pass inline literals/objects safely.
  }, [key]);

  const setValue = useCallback<SetPersistentState<T>>(
    (next) => {
      setValueRaw((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage unavailable (quota, private browsing) — state still
          // works for the current session, it just won't persist.
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setValue] as const;
}
