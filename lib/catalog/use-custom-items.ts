"use client";

import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "@/lib/safe-storage";
import type { CustomInventoryItem, NewCustomInventoryItemInput } from "./types";

const ITEMS_KEY = "juniors:custom-inventory-items:v1";

function isCustomItem(value: unknown): value is CustomInventoryItem {
  if (typeof value !== "object" || value === null) return false;
  const i = value as Partial<CustomInventoryItem>;
  return (
    typeof i.id === "string" &&
    typeof i.brand === "string" &&
    typeof i.category === "string" &&
    typeof i.quantity === "number" &&
    typeof i.price === "number"
  );
}

function isCustomItemArray(value: unknown): value is CustomInventoryItem[] {
  return Array.isArray(value) && value.every(isCustomItem);
}

function newId() {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Manager-added inventory items — see `lib/catalog/catalog-service.ts` for
 * how these combine with the bundled catalog for display.
 */
export function useCustomItems() {
  const [items, setItems] = useState<CustomInventoryItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readJSON(ITEMS_KEY, [], isCustomItemArray));
    setIsReady(true);
  }, []);

  const persist = useCallback((next: CustomInventoryItem[]) => {
    setItems(next);
    writeJSON(ITEMS_KEY, next);
  }, []);

  const addItem = useCallback(
    (input: NewCustomInventoryItemInput) => {
      const now = new Date().toISOString();
      const item: CustomInventoryItem = {
        ...input,
        id: newId(),
        source: "manual",
        archived: false,
        createdAt: now,
        updatedAt: now,
      };
      setItems((current) => {
        const next = [item, ...current];
        writeJSON(ITEMS_KEY, next);
        return next;
      });
      return item;
    },
    []
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<NewCustomInventoryItemInput>) => {
      setItems((current) => {
        const next = current.map((i) =>
          i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
        );
        writeJSON(ITEMS_KEY, next);
        return next;
      });
    },
    []
  );

  const toggleSoldOut = useCallback((id: string) => {
    setItems((current) => {
      const next = current.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity > 0 ? 0 : 1, updatedAt: new Date().toISOString() }
          : i
      );
      writeJSON(ITEMS_KEY, next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const next = current.filter((i) => i.id !== id);
      writeJSON(ITEMS_KEY, next);
      return next;
    });
  }, []);

  return { items, isReady, addItem, updateItem, toggleSoldOut, removeItem, persist };
}
