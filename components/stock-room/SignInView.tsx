"use client";

import { useState } from "react";
import { TriangleAlert, LoaderCircle } from "lucide-react";
import { useInventory } from "@/lib/inventory/provider";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function SignInView() {
  const { signIn, manager, clearManagerError } = useInventory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");

  const canSubmit = isFirebaseConfigured
    ? email.includes("@") && password.length >= 6 && !manager.isBusy
    : passcode.trim().length > 0 && !manager.isBusy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (isFirebaseConfigured) {
      await signIn(email, password);
    } else {
      await signIn(passcode);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-4 py-10">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/40">
        <span className="font-serif text-sm font-bold text-brass">21</span>
      </span>
      <h1 className="mt-4 font-serif text-2xl font-bold text-cream">Stock Room</h1>

      <form onSubmit={handleSubmit} className="mt-7 flex w-full flex-col gap-3.5">
        {isFirebaseConfigured ? (
          <>
            <Field
              placeholder="Email"
              value={email}
              onChange={setEmail}
              type="email"
              autoFocus
            />
            <Field placeholder="Password" value={password} onChange={setPassword} type="password" />
          </>
        ) : (
          <Field
            placeholder="Passcode"
            value={passcode}
            onChange={setPasscode}
            type="password"
            autoFocus
          />
        )}

        {manager.error && (
          <div className="flex items-center gap-2 rounded-xl border border-claret/45 bg-claret/15 px-3.5 py-2.5">
            <TriangleAlert size={13} className="shrink-0 text-claret" strokeWidth={2.25} />
            <p className="text-[12.5px] text-cream">{manager.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          onClick={clearManagerError}
          className="eyebrow mt-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-brass to-brass-soft py-4 text-[12px] text-ink transition-opacity disabled:opacity-40"
        >
          {manager.isBusy && <LoaderCircle size={14} className="animate-spin" />}
          {manager.isBusy ? "Signing in" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Field({
  placeholder,
  value,
  onChange,
  type,
  autoFocus,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      autoCapitalize="none"
      autoCorrect="off"
      className="w-full rounded-xl border border-hairline bg-surface px-4 py-3.5 text-center font-mono text-[15px] tracking-wide text-cream placeholder:text-cream-faint focus:border-brass/60 focus:outline-none"
    />
  );
}
