import { cn } from "@/lib/utils";

export default function SoldOutStamp({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-full border border-cream/35 bg-claret/90 text-cream shadow-[0_6px_14px_rgba(0,0,0,0.45)]",
        compact ? "px-2 py-1 text-[9px] tracking-[0.14em]" : "px-3 py-1.5 text-[11px] tracking-[0.2em]",
        className
      )}
    >
      Sold Out
    </span>
  );
}
