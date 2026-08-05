"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readJSON, writeJSON } from "@/lib/safe-storage";
import type { Customer, Transaction, TransactionType } from "./types";

const CUSTOMERS_KEY = "juniors:ledger-customers:v1";
const TRANSACTIONS_KEY = "juniors:ledger-transactions:v1";

function isCustomer(value: unknown): value is Customer {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Partial<Customer>;
  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    typeof c.balance === "number" &&
    typeof c.archived === "boolean"
  );
}

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Partial<Transaction>;
  return (
    typeof t.id === "string" &&
    typeof t.customerId === "string" &&
    typeof t.at === "string" &&
    typeof t.type === "string" &&
    typeof t.amount === "number" &&
    typeof t.balanceAfter === "number"
  );
}

function isCustomerArray(value: unknown): value is Customer[] {
  return Array.isArray(value) && value.every(isCustomer);
}

function isTransactionArray(value: unknown): value is Transaction[] {
  return Array.isArray(value) && value.every(isTransaction);
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface RecordTransactionInput {
  customerId: string;
  type: TransactionType;
  /** Unsigned magnitude — sign is derived from `type`. Ignored for "clear". */
  amount?: number;
  employeeName?: string;
  notes?: string;
  products?: string;
}

/**
 * The Stock Room's customer ledger: customers with a running balance, and
 * an append-only transaction log. Persisted to localStorage so it survives
 * a refresh or reopening the browser; every mutation is validated before
 * it's trusted on load, so a corrupted or hand-edited entry never takes
 * down the whole ledger.
 */
export function useCustomerLedger() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setCustomers(readJSON(CUSTOMERS_KEY, [], isCustomerArray));
    setTransactions(readJSON(TRANSACTIONS_KEY, [], isTransactionArray));
    setIsReady(true);
  }, []);

  const persistCustomers = useCallback((next: Customer[]) => {
    setCustomers(next);
    writeJSON(CUSTOMERS_KEY, next);
  }, []);

  const persistTransactions = useCallback((next: Transaction[]) => {
    setTransactions(next);
    writeJSON(TRANSACTIONS_KEY, next);
  }, []);

  const addCustomer = useCallback(
    (input: { name: string; phone?: string; notes?: string }) => {
      const now = new Date().toISOString();
      const customer: Customer = {
        id: newId("cust"),
        name: input.name.trim(),
        phone: input.phone?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
        balance: 0,
        archived: false,
        createdAt: now,
        updatedAt: now,
      };
      setCustomers((current) => {
        const next = [customer, ...current];
        writeJSON(CUSTOMERS_KEY, next);
        return next;
      });
      return customer;
    },
    []
  );

  const updateCustomer = useCallback(
    (id: string, patch: Partial<Pick<Customer, "name" | "phone" | "notes">>) => {
      setCustomers((current) => {
        const next = current.map((c) =>
          c.id === id
            ? {
                ...c,
                ...patch,
                name: patch.name?.trim() || c.name,
                updatedAt: new Date().toISOString(),
              }
            : c
        );
        writeJSON(CUSTOMERS_KEY, next);
        return next;
      });
    },
    []
  );

  const setArchived = useCallback((id: string, archived: boolean) => {
    setCustomers((current) => {
      const next = current.map((c) =>
        c.id === id ? { ...c, archived, updatedAt: new Date().toISOString() } : c
      );
      writeJSON(CUSTOMERS_KEY, next);
      return next;
    });
  }, []);

  const removeCustomer = useCallback((id: string) => {
    setCustomers((current) => {
      const next = current.filter((c) => c.id !== id);
      writeJSON(CUSTOMERS_KEY, next);
      return next;
    });
    setTransactions((current) => {
      const next = current.filter((t) => t.customerId !== id);
      writeJSON(TRANSACTIONS_KEY, next);
      return next;
    });
  }, []);

  /**
   * The only way a balance ever changes — appends a transaction and
   * recomputes the customer's balance from it. Never mutates or removes a
   * prior transaction.
   */
  const recordTransaction = useCallback(
    (input: RecordTransactionInput) => {
      const customer = customers.find((c) => c.id === input.customerId);
      if (!customer) return null;

      const magnitude = Math.abs(input.amount ?? 0);
      let signedAmount: number;
      let balanceAfter: number;

      switch (input.type) {
        case "charge":
          signedAmount = magnitude;
          balanceAfter = customer.balance + magnitude;
          break;
        case "payment":
          signedAmount = -magnitude;
          balanceAfter = customer.balance - magnitude;
          break;
        case "adjustment":
          signedAmount = input.amount ?? 0;
          balanceAfter = customer.balance + signedAmount;
          break;
        case "clear":
          signedAmount = -customer.balance;
          balanceAfter = 0;
          break;
        default:
          return null;
      }

      const transaction: Transaction = {
        id: newId("txn"),
        customerId: customer.id,
        at: new Date().toISOString(),
        type: input.type,
        amount: signedAmount,
        balanceAfter,
        employeeName: input.employeeName?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
        products: input.products?.trim() || undefined,
      };

      persistTransactions([transaction, ...transactions]);
      persistCustomers(
        customers.map((c) =>
          c.id === customer.id
            ? { ...c, balance: balanceAfter, updatedAt: transaction.at }
            : c
        )
      );
      return transaction;
    },
    [customers, transactions, persistCustomers, persistTransactions]
  );

  const transactionsFor = useCallback(
    (customerId: string) =>
      transactions
        .filter((t) => t.customerId === customerId)
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [transactions]
  );

  const totals = useMemo(() => {
    const active = customers.filter((c) => !c.archived);
    return {
      totalOwed: active.reduce((sum, c) => sum + Math.max(c.balance, 0), 0),
      openCount: active.filter((c) => c.balance > 0).length,
      settledCount: active.filter((c) => c.balance <= 0).length,
    };
  }, [customers]);

  return {
    customers,
    transactions,
    isReady,
    totals,
    addCustomer,
    updateCustomer,
    setArchived,
    removeCustomer,
    recordTransaction,
    transactionsFor,
  };
}
