# Junior's Wine & Liquor — Website

A dark, high-end storefront for Junior's Wine & Liquor (Bath Avenue, Brooklyn),
built with **Next.js (App Router) + TypeScript + Tailwind CSS**. It's the web
companion to the [iOS app](../ios-juniors-liquor) — same brand, same catalog,
same brass-on-espresso design language — and is set up so it can start reading
**live price & stock from Firebase** the moment you want it to.

## What's here

- **Age gate** — a full-screen 21+ check on first visit (`components/AgeGateOverlay.tsx`),
  remembered for 24 hours via `localStorage`.
- **Shelf (catalog)** — search, sort, category filters, a "Top Shelf" marquee,
  and a responsive bottle grid (`/`, `components/ShopClient.tsx`).
- **Product pages** — size/flavor selector, tasting notes, live price & stock,
  a "Reserve" call-to-action (`/product/[id]`).
- **Visit** — hours, map, phone, address (`/visit`).
- **Stock Room** — the manager dashboard: sign in, search the shelf, one-tap
  "sold out", and a per-bottle editor for price + availability (`/stock-room`).
- **Firebase-ready inventory layer** (`lib/inventory/`) — merges the bundled
  catalog with live Firestore overrides, with a local-only fallback so
  everything above works today, with zero backend configured.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The catalog, product
pages, and Stock Room all work immediately — Stock Room runs in **local demo
mode** (see below) until Firebase is connected.

## The catalog data

`lib/data/products.ts` is generated from the same `inventory.json` the iOS
app ships (149 products, ported 1:1 with their bottle photos in
`public/images/bottles/`). Treat it as the "bundled" catalog — brand names,
descriptions, sizes, and photos. Prices and stock can be overridden live via
Firebase (see below) without redeploying the site.

## Connecting Firebase for live inventory

The site is written to work with **zero configuration** — see "Local demo
mode" below — but wiring up Firebase takes about five minutes and is the same
project the iOS app already uses (see
[`ios-juniors-liquor/FIREBASE_SETUP.md`](../ios-juniors-liquor/FIREBASE_SETUP.md)
for the console-side steps and the full `products/{productId}` document
shape). Once that project exists:

1. **Firebase console → Project settings → General → Your apps** → add a
   **Web app** (or reuse an existing one) and copy its config values.
2. Copy `.env.example` to `.env.local` and fill in the `NEXT_PUBLIC_FIREBASE_*`
   values.
3. Add the same variables in **Vercel → Project → Settings → Environment
   Variables** for Preview and Production.
4. Redeploy. The Shelf will start showing a "Live prices" pill, and the Stock
   Room will ask for a real Firebase Authentication email/password sign-in
   instead of the demo passcode.

No code changes are required — `lib/firebase.ts` initializes the SDK only
when `NEXT_PUBLIC_FIREBASE_PROJECT_ID` and `NEXT_PUBLIC_FIREBASE_API_KEY` are
present, and `lib/inventory/provider.tsx` subscribes to the `products`
collection with `onSnapshot` the moment it's configured.

### Document shape (shared with the iOS app)

```
products/p12
  soldOut  : boolean            // whole product off the shelf
  updatedAt: timestamp
  variants : array of maps
      { label: "750ml", price: 27.99, soldOut: false }
      { label: "1.75L", price: 42.99, soldOut: true  }
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

### Local demo mode (no Firebase yet)

Without `NEXT_PUBLIC_FIREBASE_*` set:

- The Shelf shows an "Offline catalog · demo data" pill and serves bundled
  prices/stock.
- `/stock-room` accepts a simple passcode (`NEXT_PUBLIC_DEMO_STOCK_ROOM_PASSCODE`,
  defaults to `junior21`) instead of a real sign-in.
- Manager edits are written to `localStorage` on the visiting browser only —
  great for demos, not shared across devices. Connecting Firebase switches
  every one of these over automatically.

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

## Project structure

```
app/
  layout.tsx            Root layout: fonts, providers, age gate, chrome
  page.tsx               Shelf (catalog)
  product/[id]/page.tsx   Product detail
  visit/page.tsx          Store info
  stock-room/page.tsx     Manager dashboard
components/               UI components (cards, nav, stock room, age gate…)
lib/
  types.ts                Shared domain types
  data/products.ts         Bundled catalog (generated from inventory.json)
  product-helpers.ts       Pure helpers (pricing, filtering, sorting…)
  inventory/               Firebase-aware inventory provider + merge logic
  firebase.ts               Firebase SDK init (no-op until configured)
  age-gate.tsx              21+ verification context
public/images/bottles/    Bottle photography (shared with the iOS app)
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Lint the project |
