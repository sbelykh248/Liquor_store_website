"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAgeGate } from "@/lib/age-gate";

export default function AgeGateOverlay() {
  const { isVerified, isReady, verify, exit } = useAgeGate();
  const shouldShow = isReady && !isVerified;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="age-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto"
          style={{
            backgroundColor: "#0e0d0c",
            backgroundImage:
              "radial-gradient(circle at 50% -5%, rgba(200, 162, 74, 0.16), transparent 55%), radial-gradient(circle at 105% 72%, rgba(111, 29, 40, 0.14), transparent 50%)",
          }}
        >
          <div className="relative z-10 flex min-h-full flex-1 flex-col items-center justify-center px-6 py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.05 }}
              className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full border border-brass/35 sm:h-52 sm:w-52"
            >
              <div className="absolute inset-3 rounded-full border-[1.5px] border-brass/70" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-serif text-6xl font-bold text-cream sm:text-7xl">21</span>
                <span className="eyebrow text-[10px] text-brass">and over</span>
              </div>
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 40%, rgba(200,162,74,0.35) 50%, transparent 60%)",
                }}
                animate={{ opacity: [0, 1, 0], x: [-90, 90] }}
                transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-10 flex max-w-md flex-col items-center gap-3 text-center"
            >
              <h1 className="font-serif text-4xl font-bold text-cream sm:text-5xl">Junior&apos;s</h1>
              <p className="eyebrow text-[10px] text-cream-muted">Wine &amp; Liquor · Bath Avenue</p>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-muted sm:text-base">
                You must be of legal drinking age to browse our shelf.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex w-full max-w-sm flex-col items-center gap-4"
            >
              <button
                onClick={verify}
                className="eyebrow w-full rounded-2xl bg-gradient-to-b from-brass to-brass-soft py-4 text-[13px] text-ink shadow-[0_16px_30px_rgba(200,162,74,0.22)] transition-transform active:scale-[0.97]"
              >
                I&apos;m 21 or Older — Enter the Shop
              </button>
              <button
                onClick={exit}
                className="text-xs text-cream-faint underline-offset-4 transition-colors hover:text-cream-muted hover:underline"
              >
                I&apos;m under 21
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="eyebrow mt-10 text-center text-[9px] text-cream-faint"
            >
              Please drink responsibly
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
