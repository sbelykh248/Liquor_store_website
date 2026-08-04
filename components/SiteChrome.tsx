"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2x2, MapPin, Warehouse } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Shelf", icon: Grid2x2 },
  { href: "/visit", label: "Visit", icon: MapPin },
  { href: "/stock-room", label: "Stock Room", icon: Warehouse },
];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 hidden border-b border-hairline/60 bg-ink/85 backdrop-blur-md md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/50 font-serif text-sm font-bold text-brass">
              21
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-wide text-cream">
                JUNIOR&apos;S
              </span>
              <span className="eyebrow text-[9px] text-cream-muted">Wine &amp; Liquor</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "eyebrow rounded-full px-4 py-2 text-[11px] transition-colors",
                    isActive
                      ? "bg-brass text-ink"
                      : "text-cream-muted hover:bg-surface hover:text-cream"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a
            href="tel:7183316868"
            className="eyebrow text-[11px] text-cream-muted transition-colors hover:text-brass"
          >
            (718) 331-6868
          </a>
        </div>
      </header>

      <header className="sticky top-0 z-30 flex items-center justify-center border-b border-hairline/60 bg-ink/90 py-3 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brass/50 font-serif text-[11px] font-bold text-brass">
            21
          </span>
          <span className="font-serif text-base font-bold tracking-wide text-cream">
            JUNIOR&apos;S
          </span>
        </Link>
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <Footer />

      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-[calc(env(safe-area-inset-bottom)+14px)] md:hidden">
        <div className="flex gap-1 rounded-full border border-hairline/80 bg-surface/90 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-[76px] flex-col items-center gap-1 rounded-full px-4 py-2.5 transition-colors",
                  isActive ? "bg-gradient-to-b from-brass to-brass-soft text-ink" : "text-cream-muted"
                )}
              >
                <Icon size={16} strokeWidth={2.25} />
                <span className="text-[10.5px] font-bold tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function Footer() {
  return (
    <footer className="hidden border-t border-hairline/60 bg-surface/40 md:block">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <span className="font-serif text-xl font-bold text-cream">JUNIOR&apos;S</span>
            <p className="eyebrow mt-2 text-[10px] text-cream-faint">Est. Brooklyn</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-muted">
              A family-run bottle shop on Bath Avenue, pouring the neighborhood&apos;s
              favorites since day one.
            </p>
          </div>
          <div>
            <p className="eyebrow text-[10px] text-cream-faint">Visit</p>
            <p className="mt-3 text-sm text-cream-muted">1654 Bath Avenue</p>
            <p className="text-sm text-cream-muted">Brooklyn, NY 11214</p>
            <p className="mt-3 text-sm text-cream-muted">Mon – Sat · 1PM – 8PM</p>
            <p className="text-sm text-cream-muted">Sunday · 12PM – 6PM</p>
          </div>
          <div>
            <p className="eyebrow text-[10px] text-cream-faint">Contact</p>
            <a
              href="tel:7183316868"
              className="mt-3 block text-sm text-cream-muted transition-colors hover:text-brass"
            >
              (718) 331-6868
            </a>
            <Link
              href="/stock-room"
              className="mt-3 block text-sm text-cream-muted transition-colors hover:text-brass"
            >
              Stock Room (staff)
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t border-hairline/50 pt-6 text-center">
          <p className="eyebrow text-[9px] text-cream-faint">
            Must be 21+ to purchase &middot; Please drink responsibly
          </p>
        </div>
      </div>
    </footer>
  );
}
