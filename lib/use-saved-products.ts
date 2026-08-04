"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "juniors:saved-products:v1";

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Client-side "Cellar" — bookmarking bottles across visits, no account needed. */
export function useSavedProducts() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(load());
  }, []);

  const toggle = useCallback((productId: string) => {
    setSaved((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage failures — saved state just won't persist.
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((productId: string) => saved.includes(productId), [saved]);

  return { saved, isSaved, toggle };
}
