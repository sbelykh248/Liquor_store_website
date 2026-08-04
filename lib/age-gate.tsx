"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "juniors:age-verified:v1";
/** Re-ask after this many hours, similar to how the iOS app asks once per launch. */
const VERIFICATION_TTL_HOURS = 24;

interface AgeGateContextValue {
  isVerified: boolean;
  isReady: boolean;
  verify: () => void;
  exit: () => void;
}

const AgeGateContext = createContext<AgeGateContextValue | null>(null);

export function AgeGateProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const verifiedAt = Number(raw);
        const hoursSince = (Date.now() - verifiedAt) / (1000 * 60 * 60);
        if (Number.isFinite(verifiedAt) && hoursSince < VERIFICATION_TTL_HOURS) {
          setIsVerified(true);
        }
      }
    } catch {
      // Ignore storage access errors (private browsing) — the gate simply
      // shows again, which is the safe default.
    } finally {
      setIsReady(true);
    }
  }, []);

  const verify = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Non-fatal — verification still applies for this session.
    }
    setIsVerified(true);
  };

  const exit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <AgeGateContext.Provider value={{ isVerified, isReady, verify, exit }}>
      {children}
    </AgeGateContext.Provider>
  );
}

export function useAgeGate() {
  const ctx = useContext(AgeGateContext);
  if (!ctx) throw new Error("useAgeGate must be used within an AgeGateProvider");
  return ctx;
}
