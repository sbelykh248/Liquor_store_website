"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Check, EyeOff } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/types";
import type { SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function SortMenu({
  sortOption,
  onSortChange,
  hideSoldOut,
  onHideSoldOutChange,
  soldOutCount,
}: {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  hideSoldOut: boolean;
  onHideSoldOutChange: (value: boolean) => void;
  soldOutCount: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isCustom = sortOption !== "curated" || hideSoldOut;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.id === sortOption)!;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-chip border px-3.5 py-3 text-[12.5px] font-semibold transition-colors",
          isCustom
            ? "border-brass bg-gradient-to-b from-brass to-brass-soft text-ink"
            : "border-hairline bg-surface text-cream"
        )}
      >
        <ArrowUpDown size={13} strokeWidth={2.5} />
        {current.shortTitle}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-64 overflow-hidden rounded-2xl border border-hairline bg-surface-raised shadow-[0_20px_44px_rgba(0,0,0,0.55)]">
          <div className="border-b border-hairline/70 px-3.5 py-2.5">
            <p className="eyebrow text-[9px] text-cream-faint">Sort</p>
          </div>
          <ul className="py-1.5">
            {SORT_OPTIONS.map((option) => (
              <li key={option.id}>
                <button
                  onClick={() => {
                    onSortChange(option.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[13px] text-cream-muted transition-colors hover:bg-surface hover:text-cream"
                >
                  {option.title}
                  {option.id === sortOption && <Check size={14} className="text-brass" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-hairline/70 px-3.5 py-3">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[13px] text-cream-muted">
                <EyeOff size={14} />
                Hide sold out{soldOutCount > 0 ? ` (${soldOutCount})` : ""}
              </span>
              <input
                type="checkbox"
                checked={hideSoldOut}
                onChange={(e) => onHideSoldOutChange(e.target.checked)}
                className="h-4 w-4 accent-brass"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
