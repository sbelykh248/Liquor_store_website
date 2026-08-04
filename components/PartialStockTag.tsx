import { CircleAlert } from "lucide-react";

export default function PartialStockTag({ soldOutCount }: { soldOutCount: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brass/35 bg-brass/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brass">
      <CircleAlert size={9} strokeWidth={2.75} />
      {soldOutCount} size{soldOutCount === 1 ? "" : "s"} out
    </span>
  );
}
