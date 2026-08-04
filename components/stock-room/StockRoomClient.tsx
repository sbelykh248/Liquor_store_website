"use client";

import { useInventory } from "@/lib/inventory/provider";
import SignInView from "@/components/stock-room/SignInView";
import StockRoomDashboard from "@/components/stock-room/StockRoomDashboard";

export default function StockRoomClient() {
  const { manager } = useInventory();
  return manager.isSignedIn ? <StockRoomDashboard /> : <SignInView />;
}
