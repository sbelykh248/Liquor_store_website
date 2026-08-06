/**
 * Domain types for the Stock Room's customer ledger (tabs/balances).
 *
 * A `Customer` only ever stores its current `balance` — every change to
 * that balance is required to go through `recordTransaction` in
 * `use-customer-ledger.ts`, which appends an immutable `Transaction` and
 * recomputes the balance from it. Nothing ever overwrites transaction
 * history; corrections are new "adjustment" transactions, not edits to old
 * ones.
 */

export type TransactionType = "charge" | "payment" | "adjustment" | "clear";

export interface Transaction {
  id: string;
  customerId: string;
  /** ISO 8601 timestamp — carries both date and time. */
  at: string;
  type: TransactionType;
  /**
   * Signed amount applied to the balance for this entry (positive for a
   * charge/increase, negative for a payment/decrease). `clear` transactions
   * derive this from whatever balance existed at the time.
   */
  amount: number;
  /** Balance immediately after this transaction — a point-in-time snapshot. */
  balanceAfter: number;
  /** Staff member who recorded the transaction, if known. */
  employeeName?: string;
  notes?: string;
  /** Free-text description of items tied to a charge, e.g. "2x Josh Cabernet, 1x Titos 1.75L". */
  products?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  balance: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const TRANSACTION_LABEL: Record<TransactionType, string> = {
  charge: "Purchase / Charge",
  payment: "Payment",
  adjustment: "Adjustment",
  clear: "Balance cleared",
};
