"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";

/**
 * App-wide error boundary (Next.js App Router convention). Catches
 * unexpected render/runtime errors anywhere in the tree below the root
 * layout and shows a themed recovery screen instead of a raw stack trace,
 * so a bug in one feature (say, a corrupted localStorage record slipping
 * past validation) doesn't look like the whole site is broken.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-claret/45 bg-claret/10">
        <TriangleAlert size={20} className="text-claret" strokeWidth={2} />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-bold text-cream">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-[13.5px] text-cream-muted">
        This page hit an unexpected error. Your saved data is untouched — try again, or head back
        to the shelf.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={reset}
          className="eyebrow flex items-center gap-2 rounded-full bg-gradient-to-b from-brass to-brass-soft px-5 py-3 text-[11px] text-ink"
        >
          <RotateCcw size={13} />
          Try again
        </button>
        <Link
          href="/"
          className="eyebrow rounded-full border border-hairline px-5 py-3 text-[11px] text-cream-muted"
        >
          Back to Shelf
        </Link>
      </div>
    </div>
  );
}
