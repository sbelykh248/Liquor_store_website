"use client";

import { LogOut, RefreshCw } from "lucide-react";
import { useInventory } from "@/lib/inventory/provider";
import { usePersistentState } from "@/lib/use-persistent-state";
import { cn } from "@/lib/utils";
import SignInView from "@/components/stock-room/SignInView";
import StockRoomDashboard from "@/components/stock-room/StockRoomDashboard";
import CustomerTabs from "@/components/stock-room/CustomerTabs";
import DistributorOrders from "@/components/stock-room/DistributorOrders";

type StockRoomTab = "inventory" | "tabs" | "orders";

const TABS: { id: StockRoomTab; label: string }[] = [
  { id: "inventory", label: "Inventory" },
  { id: "tabs", label: "Customer Tabs" },
  { id: "orders", label: "Distributor Orders" },
];

export default function StockRoomClient() {
  const { manager, signOut, refresh, isFirebaseConfigured } = useInventory();
  const [tab, setTab] = usePersistentState<StockRoomTab>("juniors:stock-room-tab:v1", "inventory");

  if (!manager.isSignedIn) return <SignInView />;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <div className="flex items-center justify-between py-5">
        <div>
          <p className="eyebrow text-[9px] text-brass">
            {isFirebaseConfigured ? "Connected to Firebase" : "Local demo mode"}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-cream sm:text-3xl">Stock Room</h1>
          {manager.email && <p className="mt-0.5 text-[12px] text-cream-faint">{manager.email}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-cream-muted transition-colors hover:border-brass/50 hover:text-cream"
            aria-label="Sync"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={signOut}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-cream-muted transition-colors hover:border-claret/60 hover:text-claret"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <div className="sticky top-[57px] z-10 -mx-4 flex gap-2 overflow-x-auto border-y border-hairline/50 bg-ink/95 px-4 py-3 backdrop-blur-md no-scrollbar sm:top-[65px] sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
              tab === t.id
                ? "border-brass bg-brass text-ink"
                : "border-hairline bg-surface text-cream-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "inventory" && <StockRoomDashboard />}
        {tab === "tabs" && <CustomerTabs />}
        {tab === "orders" && <DistributorOrders />}
      </div>
    </div>
  );
}
