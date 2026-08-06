# Junior's Wine & Liquor

A storefront and back-of-house management platform for Junior's Wine & Liquor
(Bath Avenue, Brooklyn), built with **Next.js (App Router) + TypeScript +
Tailwind CSS**. It's the web companion to the [iOS app](../ios-juniors-liquor) —
same brand, same catalog, same dark brass-on-espresso design language — and
adds a real Stock Room: inventory, a customer ledger, and distributor order
tracking, on top of the customer-facing shop.

## Purpose

Two audiences, one app:

- **Customers** browse a 21+-gated catalog, filter by category, and look up
  tasting notes and pricing on any device.
- **Staff** sign in to the Stock Room to manage price and stock, track running
  customer tabs, and keep a permanent record of what's been ordered from each
  distributor — without needing a separate back-office system.

## Features

### Customer-facing

- **Age gate** — full-screen 21+ check on first visit, remembered for 24
  hours.
- **Shelf (catalog)** — search, sort, category filters, a "Top Shelf"
  marquee, and a responsive bottle grid.
- **Product pages** — size/flavor selector, tasting notes, live price &
  stock, a "Reserve" call-to-action.
- **Visit** — hours, map, phone, address.

### Stock Room (staff only, passcode- or Firebase-Auth-gated)

- **Inventory** — search and filter the whole catalog; one-tap sold-out
  toggle; a full editor for price, on-hand quantity, and availability per
  size; **Add Item** for entering new stock that isn't in the bundled
  catalog (brand, product name, category, size, quantity, cost, retail
  price, notes).
- **Customers** — a running ledger per customer: current balance, phone,
  notes, and a complete, append-only transaction history (charges,
  payments, adjustments, and balance-clears), each with a timestamp,
  optional staff name, and optional itemized notes. Search, edit, and
  archive customers without losing their history.
- **Distributor Orders** — quick links to each distributor's own official
  ordering portal (Southern Glazer's, Empire Merchants — opened in a new
  tab, never scraped or embedded), plus a permanent local record of what
  was ordered: distributor, order/expected-delivery dates, status
  (Ordered / Processing / Delivered / Cancelled), line items, and notes.
  Search, filter by distributor/status, and duplicate a past order to
  reorder quickly.

## Technologies used

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Firebase](https://firebase.google.com) (Firestore + Auth) — optional, for
  live multi-device inventory sync
- [lucide-react](https://lucide.dev) for icons, [framer-motion](https://www.framer.com/motion/)
  for the age-gate animation

No backend server of its own — it's a static/edge-renderable Next.js app,
deployed to Vercel, with an optional Firebase project for live sync.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Everything above works
immediately with zero configuration — the Stock Room runs against local
storage on your device (see [Data persistence](#data-persistence-approach)) until you connect Firebase.

## The catalog data

`lib/data/products.ts` is generated from the same `inventory.json` the iOS
app ships (149 products, ported 1:1 with their bottle photos in
`public/images/bottles/`). Treat it as the read-only "bundled" catalog —
brand names, descriptions, sizes, and photos. Prices, stock, and quantity
can be overridden live from the Stock Room without redeploying the site;
items added through **Add Item** live alongside it. See
[`lib/catalog/catalog-service.ts`](lib/catalog/catalog-service.ts) for how
the two are combined, and how a real distributor feed or CSV import would
plug in later (see [Security and Architecture Considerations](#security-and-architecture-considerations)).

## Connecting Firebase for live inventory

The site works with zero configuration, but wiring up Firebase takes about
five minutes and is the same project the iOS app already uses (see
[`ios-juniors-liquor/FIREBASE_SETUP.md`](../ios-juniors-liquor/FIREBASE_SETUP.md)
for the console-side steps and the full `products/{productId}` document
shape). Once that project exists:

1. **Firebase console → Project settings → General → Your apps** → add a
   **Web app** (or reuse an existing one) and copy its config values.
2. Copy `.env.example` to `.env.local` and fill in the `NEXT_PUBLIC_FIREBASE_*`
   values.
3. Add the same variables in **Vercel → Project → Settings → Environment
   Variables** for Preview and Production.
4. Redeploy. The Stock Room will ask for a real Firebase Authentication
   email/password sign-in instead of the local passcode, and price/stock
   overrides sync across every device instead of staying on one browser.

No code changes are required — `lib/firebase.ts` initializes the SDK only
when `NEXT_PUBLIC_FIREBASE_PROJECT_ID` and `NEXT_PUBLIC_FIREBASE_API_KEY` are
present, and `lib/inventory/provider.tsx` subscribes to the `products`
collection with `onSnapshot` the moment it's configured. The Customer ledger
and Distributor order history are local-only today regardless of Firebase —
see below.

### Document shape (shared with the iOS app)

```
products/p12
  soldOut  : boolean            // whole product off the shelf
  updatedAt: timestamp
  variants : array of maps
      { label: "750ml", price: 27.99, soldOut: false, quantity: 6 }
      { label: "1.75L", price: 42.99, soldOut: true,  quantity: 0 }
```

Firestore security rules (customers read, only signed-in managers write):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Stock Room access without Firebase

Without `NEXT_PUBLIC_FIREBASE_*` set, `/stock-room` accepts a passcode
(`NEXT_PUBLIC_STOCK_ROOM_PASSCODE`, defaults to `juniors2026`) instead of a
real sign-in. **Change this before sharing the site publicly.** It's a
convenience gate, not a security boundary — see below.

## Deploying to Vercel

This is a standard Next.js app — no special configuration needed.

```bash
npm i -g vercel   # if you don't have it
vercel link       # first time only
vercel --prod
```

Or connect the GitHub repo in the [Vercel dashboard](https://vercel.com/new)
for automatic deployments on every push (preview deployments on branches/PRs,
production on `main`). If you're using Firebase, add the
`NEXT_PUBLIC_FIREBASE_*` variables under **Settings → Environment Variables**
before your first production deploy.

## Security and Architecture Considerations

**Avoiding unofficial integrations.** This app does not scrape distributor
websites, does not reverse-engineer private distributor APIs, and does not
attempt to place, track, or pay for orders on a distributor's behalf. The
Distributor Orders section links out to each distributor's real, official
ordering portal (opened in a new tab) and keeps its own local record of what
was ordered — it treats the distributor relationship as external and
authoritative, not something to automate around.

**Preparing for API-based integrations.** `lib/catalog/catalog-service.ts`
defines the seam future integrations should use: a `CatalogProvider`
contract (`fetchRows(): Promise<InventoryRow[]>`) and a normalized
`InventoryRow` shape the Inventory tab already renders today for both the
bundled catalog and manually-added items. Adding a real source later — an
authorized distributor API, an approved data feed, or a one-off CSV import —
means implementing that one interface and adding it to `mergeCatalog`, with
no changes to the Inventory UI. No such implementation exists yet by design;
this is a contract, not a stub with fake data, so it's obvious nothing here
talks to a distributor today.

**Data persistence approach.** Everything the Stock Room manages — inventory
overrides, custom items, the customer ledger, distributor order history, and
UI preferences like the active tab and filters — is written to the
browser's `localStorage` through a small set of hooks
(`lib/use-persistent-state.ts`, `lib/safe-storage.ts`, and the
feature-specific hooks under `lib/customer-ledger/`, `lib/distributors/`,
and `lib/catalog/`). This means it works fully offline and with zero
backend, but **it is per-browser, not shared across devices or staff**,
until a Firebase project is connected (which today only covers price/stock
overrides — the ledger and order history are local-only regardless, and
would need their own Firestore collections to go multi-device; see
[Recommended next steps](#recommended-next-steps-before-a-real-launch)).
Every read from storage is validated before it's trusted
(`lib/safe-storage.ts#readJSON`) — a corrupted, hand-edited, or
unrecognized-shape record is discarded in favor of a safe default instead of
crashing the app, and nothing is ever overwritten by a partially-applied
write (see `use-customer-ledger.ts` — a transaction is appended, then the
customer's balance is recomputed from it, never the other way around).

**Secure development practices.** No secrets are committed — Firebase
config is read from `NEXT_PUBLIC_*` environment variables (client-safe by
design: the Firebase Web API key is a public client identifier, not a
secret; write access is enforced by Firestore security rules and
Authentication, not by hiding the key). The Stock Room passcode is a
convenience gate for local-only mode, not a security boundary, and is
clearly documented as something to change or replace with real
Authentication before handling real customer data. An app-wide error
boundary (`app/error.tsx`) catches unexpected runtime errors without
exposing a stack trace to end users.

## Project structure

```
app/
  layout.tsx              Root layout: fonts, providers, age gate, chrome
  error.tsx                App-wide error boundary
  not-found.tsx            404 page
  page.tsx                 Shelf (catalog)
  product/[id]/page.tsx     Product detail
  visit/page.tsx            Store info
  stock-room/page.tsx       Manager dashboard
components/
  stock-room/               Inventory, Customers, Distributor Orders tabs
    customer-ledger/         Customer list + detail/transaction modal
    distributor/              Portal links, order form, order history
    inventory/                 Add/edit item form
lib/
  types.ts                  Shared catalog domain types
  data/products.ts           Bundled catalog (generated from inventory.json)
  product-helpers.ts          Pure helpers (pricing, filtering, sorting…)
  inventory/                   Firebase-aware inventory provider + merge logic
  catalog/                      Custom items + catalog-service integration seam
  customer-ledger/               Customer/transaction types + persistence hook
  distributors/                   Distributor info + order history persistence hook
  firebase.ts                Firebase SDK init (no-op until configured)
  safe-storage.ts             Defensive localStorage read/write helpers
  use-persistent-state.ts      Generic persisted useState (tabs, filters, sort)
  age-gate.tsx                21+ verification context
public/images/bottles/     Bottle photography (shared with the iOS app)
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Lint the project |

## Recommended next steps before a real launch

- **Multi-device Stock Room data.** Extend the Firestore integration (or a
  similar backend) to cover the customer ledger and distributor order
  history, not just price/stock — today those are local to whichever
  browser recorded them.
- **Real staff accounts.** Replace the shared local passcode with per-staff
  Firebase Authentication accounts so transactions and orders can reliably
  record *who* took an action.
- **A real distributor/catalog integration**, implemented against
  `CatalogProvider` in `lib/catalog/catalog-service.ts`, once a distributor
  offers an authorized API, feed, or export format.
- **Backups/export** for the customer ledger and order history (e.g. CSV
  export), since `localStorage` isn't a durable system of record on its
  own.
- **Automated tests** around the ledger's balance math and the inventory
  merge logic, given how much of the Stock Room depends on both being
  exactly right.
