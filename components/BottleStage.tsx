import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Stages a bottle photo the way `Views/BottleImage.swift` does: a fixed-height
 * box, the photo scaled to fit and bottom-aligned onto a shared baseline, with
 * a soft elliptical "shelf shadow" underneath so every bottle — regardless of
 * its source photo's aspect ratio — reads as standing on the same shelf.
 */
export default function BottleStage({
  src,
  alt,
  height,
  inset = 16,
  showsShelf = true,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  height: number;
  inset?: number;
  showsShelf?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
    >
      {showsShelf && (
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-md"
          style={{
            width: `${100 - inset * 0.24}%`,
            height: height * 0.1,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 72%)",
            transform: `translate(-50%, ${-inset * 0.35}px)`,
          }}
        />
      )}
      <div className="absolute inset-0" style={{ padding: inset }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, 220px"
          priority={priority}
          className="object-contain object-bottom drop-shadow-[0_10px_14px_rgba(0,0,0,0.5)]"
        />
      </div>
    </div>
  );
}
