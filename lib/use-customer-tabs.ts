"use client";

import { useCallback, useEffect, useState } from "react";

export type TabStatus = "open" | "paid";

export interface CustomerTab {
  id: string;
  name: string;
  amount: number;
  note: string;
  status: TabStatus;
  createdAt: string;
}

const STORAGE_KEY = "juniors:customer-tabs:v1";

function load(): CustomerTab[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomerTab[]) : [];
  } catch {
    return [];
  }
}

function save(tabs: CustomerTab[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  } catch {
    // Storage unavailable — the in-memory state for this session still works.
  }
}

/**
 * Local, per-browser "who owes what" tracker for the Stock Room. Purely a
 * demo/convenience tool for now — see the "Demo data" note in the UI. A
 * real deployment would swap this for a Firestore-backed collection the
 * same way `lib/inventory` is set up to.
 */
export function useCustomerTabs() {
  const [tabs, setTabs] = useState<CustomerTab[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTabs(load());
    setIsReady(true);
  }, []);

  const addTab = useCallback((entry: Omit<CustomerTab, "id" | "createdAt">) => {
    setTabs((current) => {
      const next: CustomerTab[] = [
        {
          ...entry,
          id: `tab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ];
      save(next);
      return next;
    });
  }, []);

  const updateTab = useCallback((id: string, patch: Partial<Omit<CustomerTab, "id">>) => {
    setTabs((current) => {
      const next = current.map((t) => (t.id === id ? { ...t, ...patch } : t));
      save(next);
      return next;
    });
  }, []);

  const removeTab = useCallback((id: string) => {
    setTabs((current) => {
      const next = current.filter((t) => t.id !== id);
      save(next);
      return next;
    });
  }, []);

  return { tabs, isReady, addTab, updateTab, removeTab };
}
