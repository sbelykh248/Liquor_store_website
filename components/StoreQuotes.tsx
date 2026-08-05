import { cn } from "@/lib/utils";

/**
 * A tasteful pull-quote: thin gold rule(s), italic serif line, small brass
 * attribution. `variant="primary"` is the site's central philosophy quote —
 * larger type and a heavier gold flourish so it reads as the most important
 * line on the page. `variant="secondary"` (default) is for supporting quotes
 * placed near a footer or section divider, styled to feel intentional
 * without competing with the primary quote.
 */
export default function StoreQuote({
  line,
  attribution,
  variant = "secondary",
  className,
}: {
  line: string;
  attribution?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const isPrimary = variant === "primary";

  return (
    <figure className={cn("flex flex-col items-center gap-4 text-center", className)}>
      <span
        className={cn(
          "bg-gradient-to-r from-transparent via-brass to-transparent",
          isPrimary ? "h-px w-16" : "h-px w-8 opacity-70"
        )}
      />
      <blockquote
        className={cn(
          "font-serif italic leading-snug text-cream-muted",
          isPrimary
            ? "max-w-2xl text-2xl font-medium text-cream sm:text-4xl"
            : "max-w-md text-base sm:text-lg"
        )}
      >
        &ldquo;{line}&rdquo;
      </blockquote>
      {attribution && (
        <figcaption
          className={cn(
            "eyebrow text-brass",
            isPrimary ? "text-[11px]" : "text-[9px] opacity-80"
          )}
        >
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}
