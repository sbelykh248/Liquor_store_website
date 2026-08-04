const QUOTES = [
  {
    line: "Every bottle on this shelf, I\u2019d pour for my own family.",
    attribution: "Junior",
  },
  {
    line: "Family-owned since day one \u2014 the best selection in Brooklyn, period.",
    attribution: "Est. Bath Avenue",
  },
];

export default function StoreQuotes() {
  return (
    <section className="grid gap-5 sm:grid-cols-2">
      {QUOTES.map((quote) => (
        <figure key={quote.attribution} className="flex flex-col items-center gap-3 text-center">
          <span className="h-px w-8 bg-brass/50" />
          <blockquote className="font-serif text-lg italic leading-snug text-cream-muted sm:text-xl">
            &ldquo;{quote.line}&rdquo;
          </blockquote>
          <figcaption className="eyebrow text-[9px] text-brass">{quote.attribution}</figcaption>
        </figure>
      ))}
    </section>
  );
}
