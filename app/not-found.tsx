import Link from "next/link";
import { Wine } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/40">
        <Wine size={20} className="text-brass" strokeWidth={2} />
      </span>
      <h1 className="mt-5 font-serif text-3xl font-bold text-cream">Nothing on this shelf</h1>
      <p className="mt-2 max-w-sm text-[13.5px] text-cream-muted">
        That page doesn&apos;t exist, or it&apos;s moved. Let&apos;s get you back to the bottles.
      </p>
      <Link
        href="/"
        className="eyebrow mt-6 rounded-full bg-gradient-to-b from-brass to-brass-soft px-5 py-3 text-[11px] text-ink"
      >
        Back to Shelf
      </Link>
    </div>
  );
}
