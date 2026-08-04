import type { Metadata } from "next";
import { Clock, MapPin, Phone, Navigation } from "lucide-react";
import StoreQuote from "@/components/StoreQuotes";

export const metadata: Metadata = {
  title: "Visit",
  description: "Hours, address, and directions to Junior's Wine & Liquor on Bath Avenue, Brooklyn.",
};

const HOURS = [
  { days: "Monday – Saturday", time: "1:00 PM – 8:00 PM" },
  { days: "Sunday", time: "12:00 PM – 6:00 PM" },
];

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-14">
      <div className="text-center sm:text-left">
        <h1 className="font-serif text-4xl font-bold text-cream sm:text-5xl">Visit Us</h1>
        <p className="mt-2 text-sm text-cream-muted">Family-run on Bath Avenue since day one</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-hairline/60 bg-surface shadow-[0_18px_36px_rgba(0,0,0,0.4)]">
        <iframe
          title="Junior's Wine & Liquor map"
          src="https://www.google.com/maps?q=1654+Bath+Ave,+Brooklyn,+NY+11214&output=embed"
          className="h-56 w-full grayscale-[15%] sm:h-72"
          loading="lazy"
        />
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
          <div>
            <p className="font-serif text-base font-semibold text-cream">1654 Bath Avenue</p>
            <p className="text-[13px] text-cream-muted">Brooklyn, NY 11214</p>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=1654+Bath+Ave,+Brooklyn,+NY+11214"
            target="_blank"
            rel="noreferrer"
            className="eyebrow flex items-center gap-1.5 rounded-full bg-brass px-4 py-2.5 text-[10.5px] text-ink"
          >
            <Navigation size={12} strokeWidth={2.5} />
            Directions
          </a>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-hairline/60 bg-surface p-5">
        <div className="mb-3.5 flex items-center gap-2">
          <span className="h-px w-6 bg-brass" />
          <p className="eyebrow text-[10px] text-cream-faint">Hours</p>
        </div>
        {HOURS.map((entry, i) => (
          <div key={entry.days}>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-cream-muted">{entry.days}</span>
              <span className="font-mono text-[13px] font-medium text-cream">{entry.time}</span>
            </div>
            {i < HOURS.length - 1 && <div className="h-px bg-hairline/50" />}
          </div>
        ))}
      </div>

      <a
        href="tel:7183316868"
        className="mt-5 flex items-center gap-3.5 rounded-3xl border border-hairline/60 bg-surface p-5 transition-colors hover:border-brass/40"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass/15">
          <Phone size={17} className="text-brass" strokeWidth={2.25} />
        </span>
        <div>
          <p className="font-mono text-base font-semibold text-cream">(718) 331-6868</p>
          <p className="text-[12px] text-cream-muted">Call to reserve or ask about stock</p>
        </div>
      </a>

      <div className="mt-5 flex items-center gap-3.5 rounded-3xl border border-hairline/60 bg-surface p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-raised">
          <MapPin size={16} className="text-cream-muted" strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-sm font-semibold text-cream">Bath Avenue, Bensonhurst</p>
          <p className="text-[12px] text-cream-muted">Brooklyn, New York</p>
        </div>
      </div>

      <div className="mt-12">
        <StoreQuote line="Family-owned since day one" attribution="Junior's Wine & Liquor" />
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <span className="h-px w-10 bg-brass/40" />
        <p className="eyebrow text-[9px] text-cream-faint">
          Must be 21+ to purchase &middot; Please drink responsibly
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5">
        <Clock size={12} className="text-cream-faint" />
        <p className="text-[11px] text-cream-faint">Times shown in local store time</p>
      </div>
    </div>
  );
}
