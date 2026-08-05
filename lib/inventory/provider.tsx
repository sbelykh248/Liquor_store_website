"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { products as bundledProducts } from "@/lib/data/products";
import type { Product, ProductOverride } from "@/lib/types";
import { mergeOverrides } from "@/lib/inventory/merge";
import { auth, firestore, isFirebaseConfigured } from "@/lib/firebase";

export type SyncState = "notConnected" | "syncing" | "live" | "stale";

const OVERRIDES_CACHE_KEY = "juniors:overrides-cache:v1";
const DEMO_SESSION_KEY = "juniors:demo-manager-session:v1";

/**
 * Passcode used to unlock the Stock Room while no Firebase project is wired
 * up yet. Purely a local, client-side demo gate — it does not protect any
 * real data. Once `NEXT_PUBLIC_FIREBASE_*` env vars are set, real
 * email/password sign-in (Firebase Auth) takes over automatically.
 */
const DEMO_PASSCODE = process.env.NEXT_PUBLIC_DEMO_STOCK_ROOM_PASSCODE || "juniors2026";
const MANAGER_EMAIL = "manager@juniorswineliquor.com";

interface ManagerState {
  isSignedIn: boolean;
  email: string | null;
  error: string | null;
  isBusy: boolean;
  mode: "firebase" | "demo";
}

interface InventoryContextValue {
  products: Product[];
  syncState: SyncState;
  lastSyncedAt: Date | null;
  isFirebaseConfigured: boolean;
  refresh: () => void;
  manager: ManagerState;
  signIn: (emailOrPasscode: string, password?: string) => Promise<boolean>;
  signOut: () => void;
  clearManagerError: () => void;
  toggleProductSoldOut: (productId: string) => Promise<void>;
  updateVariant: (
    productId: string,
    label: string,
    patch: { price?: number; isSoldOut?: boolean }
  ) => Promise<void>;
  publishOverride: (productId: string, override: ProductOverride) => Promise<void>;
  getOverride: (productId: string) => ProductOverride | undefined;
  getProduct: (id: string) => Product | undefined;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

function loadCachedOverrides(): Record<string, ProductOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(OVERRIDES_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ProductOverride>) : {};
  } catch {
    return {};
  }
}

function saveCachedOverrides(overrides: Record<string, ProductOverride>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OVERRIDES_CACHE_KEY, JSON.stringify(overrides));
  } catch {
    // Storage can be unavailable (private browsing, quota) — safe to ignore,
    // the in-memory state still works for the current session.
  }
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({});
  const [syncState, setSyncState] = useState<SyncState>(
    isFirebaseConfigured ? "syncing" : "notConnected"
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [manager, setManager] = useState<ManagerState>({
    isSignedIn: false,
    email: null,
    error: null,
    isBusy: false,
    mode: isFirebaseConfigured ? "firebase" : "demo",
  });
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const products = useMemo(() => mergeOverrides(bundledProducts, overrides), [overrides]);

  // Hydrate from the local cache immediately so the shelf never flashes
  // bundled-only prices while Firestore connects.
  useEffect(() => {
    setOverrides(loadCachedOverrides());
  }, []);

  const subscribe = useCallback(() => {
    if (!isFirebaseConfigured || !firestore) return;
    setSyncState("syncing");

    let cancelled = false;
    import("firebase/firestore").then(({ collection, onSnapshot }) => {
      if (cancelled || !firestore) return;
      const unsub = onSnapshot(
        collection(firestore, "products"),
        (snapshot) => {
          const next: Record<string, ProductOverride> = {};
          snapshot.forEach((docSnap) => {
            next[docSnap.id] = docSnap.data() as ProductOverride;
          });
          setOverrides(next);
          saveCachedOverrides(next);
          setSyncState("live");
          setLastSyncedAt(new Date());
        },
        () => {
          setSyncState("stale");
        }
      );
      unsubscribeRef.current = unsub;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    subscribe();
    return () => {
      unsubscribeRef.current?.();
    };
  }, [subscribe]);

  // Restore the demo session (local-only mode) or Firebase auth session.
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth!, (user) => {
          setManager((m) => ({
            ...m,
            isSignedIn: Boolean(user),
            email: user?.email ?? null,
          }));
        });
      });
    } else if (typeof window !== "undefined") {
      const signedIn = window.localStorage.getItem(DEMO_SESSION_KEY) === "true";
      if (signedIn) {
        setManager((m) => ({ ...m, isSignedIn: true, email: MANAGER_EMAIL }));
      }
    }
  }, []);

  const refresh = useCallback(() => {
    if (isFirebaseConfigured) {
      subscribe();
    } else {
      setOverrides(loadCachedOverrides());
    }
  }, [subscribe]);

  const signIn = useCallback(async (emailOrPasscode: string, password?: string) => {
    setManager((m) => ({ ...m, isBusy: true, error: null }));

    if (isFirebaseConfigured && auth) {
      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        const cred = await signInWithEmailAndPassword(auth, emailOrPasscode, password ?? "");
        setManager((m) => ({
          ...m,
          isSignedIn: true,
          email: cred.user.email,
          isBusy: false,
          error: null,
        }));
        return true;
      } catch {
        setManager((m) => ({
          ...m,
          isBusy: false,
          error: "Couldn't sign in. Check the email and password and try again.",
        }));
        return false;
      }
    }

    // Local demo mode.
    await new Promise((r) => setTimeout(r, 350));
    if (emailOrPasscode.trim() === DEMO_PASSCODE) {
      window.localStorage.setItem(DEMO_SESSION_KEY, "true");
      setManager((m) => ({
        ...m,
        isSignedIn: true,
        email: MANAGER_EMAIL,
        isBusy: false,
        error: null,
      }));
      return true;
    }
    setManager((m) => ({
      ...m,
      isBusy: false,
      error: "Incorrect passcode.",
    }));
    return false;
  }, []);

  const signOut = useCallback(() => {
    if (isFirebaseConfigured && auth) {
      import("firebase/auth").then(({ signOut: fbSignOut }) => fbSignOut(auth!));
    } else {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
    }
    setManager((m) => ({ ...m, isSignedIn: false, email: null }));
  }, []);

  const clearManagerError = useCallback(() => {
    setManager((m) => ({ ...m, error: null }));
  }, []);

  const persistOverride = useCallback(
    async (productId: string, next: ProductOverride) => {
      const nextOverrides = { ...overrides, [productId]: next };
      setOverrides(nextOverrides);
      saveCachedOverrides(nextOverrides);

      if (isFirebaseConfigured && firestore) {
        const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
        await setDoc(
          doc(firestore, "products", productId),
          { ...next, updatedAt: serverTimestamp() },
          { merge: false }
        );
      }
    },
    [overrides]
  );

  const toggleProductSoldOut = useCallback(
    async (productId: string) => {
      const product = bundledProducts.find((p) => p.id === productId);
      if (!product) return;
      const current = overrides[productId];
      const currentlySoldOut = current?.soldOut ?? false;
      await persistOverride(productId, {
        soldOut: !currentlySoldOut,
        variants: current?.variants ?? [],
        updatedAt: new Date().toISOString(),
      });
    },
    [overrides, persistOverride]
  );

  const updateVariant = useCallback(
    async (productId: string, label: string, patch: { price?: number; isSoldOut?: boolean }) => {
      const product = bundledProducts.find((p) => p.id === productId);
      if (!product) return;
      const current = overrides[productId];
      const variantOverrides = current?.variants ? [...current.variants] : [];
      const idx = variantOverrides.findIndex((v) => v.label === label);
      const merged = {
        label,
        price: patch.price ?? (idx >= 0 ? variantOverrides[idx].price : undefined),
        soldOut: patch.isSoldOut ?? (idx >= 0 ? variantOverrides[idx].soldOut : undefined),
      };
      if (idx >= 0) {
        variantOverrides[idx] = merged;
      } else {
        variantOverrides.push(merged);
      }
      await persistOverride(productId, {
        soldOut: current?.soldOut ?? false,
        variants: variantOverrides,
        updatedAt: new Date().toISOString(),
      });
    },
    [overrides, persistOverride]
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getOverride = useCallback((id: string) => overrides[id], [overrides]);

  const value: InventoryContextValue = {
    products,
    syncState,
    lastSyncedAt,
    isFirebaseConfigured,
    refresh,
    manager,
    signIn,
    signOut,
    clearManagerError,
    toggleProductSoldOut,
    updateVariant,
    publishOverride: persistOverride,
    getOverride,
    getProduct,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within an InventoryProvider");
  return ctx;
}
