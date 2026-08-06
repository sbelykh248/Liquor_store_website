"use client";

import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "@/lib/safe-storage";
import type { DistributorOrder, OrderLineItem, OrderStatus } from "./types";

const ORDERS_KEY = "juniors:distributor-orders:v2";

function isLineItem(value: unknown): value is OrderLineItem {
  if (typeof value !== "object" || value === null) return false;
  const i = value as Partial<OrderLineItem>;
  return typeof i.id === "string" && typeof i.name === "string" && typeof i.quantity === "string";
}

function isOrder(value: unknown): value is DistributorOrder {
  if (typeof value !== "object" || value === null) return false;
  const o = value as Partial<DistributorOrder>;
  return (
    typeof o.id === "string" &&
    typeof o.distributorId === "string" &&
    typeof o.distributorName === "string" &&
    typeof o.orderDate === "string" &&
    typeof o.status === "string" &&
    Array.isArray(o.items) &&
    o.items.every(isLineItem)
  );
}

function isOrderArray(value: unknown): value is DistributorOrder[] {
  return Array.isArray(value) && value.every(isOrder);
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface NewOrderInput {
  distributorId: string;
  distributorName: string;
  orderDate: string;
  expectedDelivery: string;
  status: OrderStatus;
  items: Omit<OrderLineItem, "id">[];
  notes: string;
}

/**
 * Local record of distributor orders placed through the official portals
 * (see `DISTRIBUTORS` in `types.ts`). This app never places or fetches
 * orders itself — it just remembers what was ordered so history survives
 * a refresh or reopening the browser.
 */
export function useDistributorOrders() {
  const [orders, setOrders] = useState<DistributorOrder[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setOrders(readJSON(ORDERS_KEY, [], isOrderArray));
    setIsReady(true);
  }, []);

  const persist = useCallback((next: DistributorOrder[]) => {
    setOrders(next);
    writeJSON(ORDERS_KEY, next);
  }, []);

  const addOrder = useCallback(
    (input: NewOrderInput) => {
      const now = new Date().toISOString();
      const order: DistributorOrder = {
        id: newId("order"),
        distributorId: input.distributorId,
        distributorName: input.distributorName,
        orderDate: input.orderDate,
        expectedDelivery: input.expectedDelivery,
        status: input.status,
        items: input.items.map((i) => ({ ...i, id: newId("item") })),
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };
      setOrders((current) => {
        const next = [order, ...current];
        writeJSON(ORDERS_KEY, next);
        return next;
      });
      return order;
    },
    []
  );

  const updateOrder = useCallback(
    (id: string, patch: Partial<NewOrderInput>) => {
      setOrders((current) => {
        const next = current.map((o) => {
          if (o.id !== id) return o;
          const items = patch.items ? patch.items.map((i) => ({ ...i, id: newId("item") })) : o.items;
          return { ...o, ...patch, items, updatedAt: new Date().toISOString() };
        });
        writeJSON(ORDERS_KEY, next);
        return next;
      });
    },
    []
  );

  const removeOrder = useCallback((id: string) => {
    setOrders((current) => {
      const next = current.filter((o) => o.id !== id);
      writeJSON(ORDERS_KEY, next);
      return next;
    });
  }, []);

  const duplicateOrder = useCallback(
    (id: string) => {
      const source = orders.find((o) => o.id === id);
      if (!source) return null;
      const now = new Date().toISOString();
      const copy: DistributorOrder = {
        ...source,
        id: newId("order"),
        orderDate: now.slice(0, 10),
        expectedDelivery: "",
        status: "ordered",
        items: source.items.map((i) => ({ ...i, id: newId("item") })),
        createdAt: now,
        updatedAt: now,
      };
      setOrders((current) => {
        const next = [copy, ...current];
        writeJSON(ORDERS_KEY, next);
        return next;
      });
      return copy;
    },
    [orders]
  );

  return { orders, isReady, addOrder, updateOrder, removeOrder, duplicateOrder, persist };
}
