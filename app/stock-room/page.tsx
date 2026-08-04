import type { Metadata } from "next";
import StockRoomClient from "@/components/stock-room/StockRoomClient";

export const metadata: Metadata = {
  title: "Stock Room",
  robots: { index: false, follow: false },
};

export default function StockRoomPage() {
  return <StockRoomClient />;
}
