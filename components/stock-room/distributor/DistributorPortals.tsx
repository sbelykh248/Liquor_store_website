import { ExternalLink, Truck } from "lucide-react";
import { DISTRIBUTORS } from "@/lib/distributors/types";

/**
 * Quick links to each distributor's own official ordering site. This app
 * never places orders itself or logs in on a store's behalf — it just
 * opens the real portal in a new tab. See `OrderHistory` below for
 * recording what was ordered once it's placed there.
 */
export default function DistributorPortals() {
  return (
    <div className="rounded-2xl border border-hairline/60 bg-surface p-4">
      <p className="eyebrow text-[9px] text-cream-faint">Distributor portals</p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-cream-muted">
        These open each distributor&apos;s own official ordering site in a new tab. Place the order
        there, then record it below to keep a permanent history in one place.
      </p>
      <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
        {DISTRIBUTORS.map((d) => (
          <a
            key={d.id}
            href={d.portalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-raised px-4 py-3.5 transition-colors hover:border-brass/50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass/15">
              <Truck size={15} className="text-brass" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-cream">{d.name} Portal</p>
              <p className="truncate text-[11px] text-cream-faint">{d.portalLabel}</p>
            </div>
            <ExternalLink size={14} className="shrink-0 text-cream-faint" />
          </a>
        ))}
      </div>
    </div>
  );
}
