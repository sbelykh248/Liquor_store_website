import DistributorPortals from "@/components/stock-room/distributor/DistributorPortals";
import OrderHistory from "@/components/stock-room/distributor/OrderHistory";

export default function DistributorOrders() {
  return (
    <div className="flex flex-col gap-6">
      <DistributorPortals />
      <OrderHistory />
    </div>
  );
}
