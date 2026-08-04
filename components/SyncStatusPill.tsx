"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SyncState } from "@/lib/inventory/provider";

function relativeTime(date: Date): string {
  const seconds = (Date.now() - date.getTime()) / 1000;
  if (seconds < 90) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function SyncStatusPill({
  state,
  lastSyncedAt,
  onRetry,
}: {
  state: SyncState;
  lastSyncedAt: Date | null;
  onRetry: () => void;
}) {
  const tint =
    state === "live"
      ? "text-brass border-brass/35 bg-brass/10"
      : state === "syncing"
        ? "text-brass/85 border-brass/30 bg-brass/10"
        : state === "stale"
          ? "text-claret border-claret/40 bg-claret/10"
          : "text-cream-faint border-hairline bg-surface/60";

  const label =
    state === "syncing"
      ? "Updating prices"
      : state === "live"
        ? `Live prices${lastSyncedAt ? ` · ${relativeTime(lastSyncedAt)}` : ""}`
        : state === "stale"
          ? "Prices may be out of date"
          : "Offline catalog · demo data";

  return (
    <button
      onClick={onRetry}
      className={cn(
        "eyebrow inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] transition-colors",
        tint
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-60",
            state === "live" && "animate-ping bg-brass"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            state === "live" || state === "syncing"
              ? "bg-brass"
              : state === "stale"
                ? "bg-claret"
                : "bg-cream-faint"
          )}
        />
      </span>
      {label}
      <RefreshCw size={9} strokeWidth={3} className={cn(state === "syncing" && "animate-spin")} />
    </button>
  );
}
