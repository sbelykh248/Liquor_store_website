/**
 * Domain types for the Stock Room's distributor workflow: quick links out
 * to each distributor's own official ordering portal, plus a local record
 * of orders placed there (this app never talks to a distributor directly —
 * see README "Security and Architecture Considerations").
 */

export type OrderStatus = "ordered" | "processing" | "delivered" | "cancelled";

export interface DistributorInfo {
  id: string;
  name: string;
  /** Official ordering portal — opened in a new tab, never embedded/scraped. */
  portalUrl: string;
  portalLabel: string;
}

export interface OrderLineItem {
  id: string;
  name: string;
  quantity: string;
}

export interface DistributorOrder {
  id: string;
  distributorId: string;
  distributorName: string;
  /** ISO date (yyyy-mm-dd) the order was placed. */
  orderDate: string;
  /** ISO date (yyyy-mm-dd), optional. */
  expectedDelivery: string;
  status: OrderStatus;
  items: OrderLineItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const DISTRIBUTORS: DistributorInfo[] = [
  {
    id: "southern-glazers",
    name: "Southern Glazer's",
    portalUrl: "https://shop.sgproof.com/",
    portalLabel: "Proof by Southern Glazer's",
  },
  {
    id: "empire",
    name: "Empire Merchants",
    portalUrl: "https://empire360.com/",
    portalLabel: "Empire360",
  },
];

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: string }> = {
  ordered: { label: "Ordered", tone: "bg-hairline/40 text-cream-muted" },
  processing: { label: "Processing", tone: "bg-brass/15 text-brass" },
  delivered: { label: "Delivered", tone: "bg-cream/15 text-cream" },
  cancelled: { label: "Cancelled", tone: "bg-claret/20 text-claret" },
};

export const ORDER_STATUSES: OrderStatus[] = ["ordered", "processing", "delivered", "cancelled"];
