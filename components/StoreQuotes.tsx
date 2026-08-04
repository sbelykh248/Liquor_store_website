import { cn } from "@/lib/utils";

/**
 * A single tasteful pull-quote: thin gold rule, italic serif line, small
 * brass attribution. Used once near the top of the shelf and once near the
 * footer (see `ShopClient` and `SiteChrome`).
 */
export default function StoreQuote({
  line,
  attribution,
  className,
}: {
  line: string;
  attribution?: string;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col items-center gap-3 text-center", className)}>
      <span className="h-px w-8 bg-brass/50" />
      <blockquote className="max-w-md font-serif text-lg italic leading-snug text-cream-muted sm:text-xl">
        &ldquo;{line}&rdquo;
      </blockquote>
      {attribution && <figcaption className="eyebrow text-[9px] text-brass">{attribution}</figcaption>}
    </figure>
  );
}
