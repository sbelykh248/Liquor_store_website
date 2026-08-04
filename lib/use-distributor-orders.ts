"use client";

import { useCallback, useEffect, useState } from "react";

export type OrderStatus = "confirmed" | "pending" | "backordered" | "delivered";

export interface DistributorOrderItem {
  id: string;
  item: string;
  quantity: string;
  eta: string;
  status: OrderStatus;
}

export interface Distributor {
  id: string;
  name: string;
  items: DistributorOrderItem[];
}

const STORAGE_KEY = "juniors:distributor-orders:v1";

const DEFAULT_DISTRIBUTORS: Distributor[] = [
  {
    id: "southern-glazers",
    name: "Southern Glazer's",
    items: [
      {
        id: "sg-1",
        item: "Tito's Handmade Vodka 1.75L",
        quantity: "12 cases",
        eta: "Fri, Aug 8",
        status: "confirmed",
      },
      {
        id: "sg-2",
        item: "Josh Cellars Cabernet 750ml",
        quantity: "6 cases",
        eta: "Tue, Aug 12",
        status: "pending",
      },
      {
        id: "sg-3",
        item: "Jameson Irish Whiskey 750ml",
        quantity: "8 cases",
        eta: "Mon, Aug 11",
        status: "confirmed",
      },
    ],
  },
  {
    id: "empire",
    name: "Empire",
    items: [
      {
        id: "emp-1",
        item: "Patrón Silver 750ml",
        quantity: "4 cases",
        eta: "TBD",
        status: "pending",
      },
      {
        id: "emp-2",
        item: "Ketel One Vodka 1L",
        quantity: "10 cases",
        eta: "Thu, Aug 7",
        status: "confirmed",
      },
      {
        id: "emp-3",
        item: "Veuve Clicquot Brut 750ml",
        quantity: "3 cases",
        eta: "Delayed",
        status: "backordered",
      },
    ],
  },
];

function load(): Distributor[] {
  if (typeof window === "undefined") return DEFAULT_DISTRIBUTORS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DISTRIBUTORS;
    return JSON.parse(raw) as Distributor[];
  } catch {
    return DEFAULT_DISTRIBUTORS;
  }
}

function save(distributors: Distributor[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(distributors));
  } catch {
    // Storage unavailable — in-memory state for this session still works.
  }
}

/**
 * Local, per-browser tracker for upcoming distributor orders, pre-seeded
 * with a couple of realistic placeholder orders so the panel looks useful
 * immediately. Purely a demo/editable placeholder for now — see the note in
 * the UI — a real deployment would replace this with a live distributor
 * feed or a Firestore-backed collection.
 */
export function useDistributorOrders() {
  const [distributors, setDistributors] = useState<Distributor[]>(DEFAULT_DISTRIBUTORS);

  useEffect(() => {
    setDistributors(load());
  }, []);

  const persist = useCallback((next: Distributor[]) => {
    setDistributors(next);
    save(next);
  }, []);

  const addItem = useCallback(
    (distributorId: string, entry: Omit<DistributorOrderItem, "id">) => {
      setDistributors((current) => {
        const next = current.map((d) =>
          d.id === distributorId
            ? {
                ...d,
                items: [
                  {
                    ...entry,
                    id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                  },
                  ...d.items,
                ],
              }
            : d
        );
        save(next);
        return next;
      });
    },
    []
  );

  const updateItem = useCallback(
    (distributorId: string, itemId: string, patch: Partial<Omit<DistributorOrderItem, "id">>) => {
      setDistributors((current) => {
        const next = current.map((d) =>
          d.id === distributorId
            ? { ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
            : d
        );
        save(next);
        return next;
      });
    },
    []
  );

  const removeItem = useCallback((distributorId: string, itemId: string) => {
    setDistributors((current) => {
      const next = current.map((d) =>
        d.id === distributorId ? { ...d, items: d.items.filter((i) => i.id !== itemId) } : d
      );
      save(next);
      return next;
    });
  }, []);

  return { distributors, addItem, updateItem, removeItem, resetToDefaults: () => persist(DEFAULT_DISTRIBUTORS) };
}
