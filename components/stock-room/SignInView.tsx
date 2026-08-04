"use client";

import { useState } from "react";
import { TriangleAlert, LoaderCircle, KeyRound } from "lucide-react";
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
    <div className="mx-auto max-w-md px-4 pb-20 pt-10 sm:px-0">
      <p className="eyebrow text-[9px] text-brass">Staff only</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-cream">Manager sign-in</h1>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-cream-muted">
        {isFirebaseConfigured
          ? "Use the Firebase Authentication account you created for the store. Customers never see this screen."
          : "No Firebase project is connected yet, so the Stock Room is running in local demo mode. Enter the demo passcode to try it out."}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        {isFirebaseConfigured ? (
          <>
            <Field
              label="Email"
              placeholder="owner@juniors.com"
              value={email}
              onChange={setEmail}
              type="email"
            />
            <Field
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              type="password"
            />
          </>
        ) : (
          <Field
            label="Demo passcode"
            placeholder="Ask the developer for the demo passcode"
            value={passcode}
            onChange={setPasscode}
            type="password"
            icon={<KeyRound size={13} />}
          />
        )}

        {manager.error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-claret/45 bg-claret/15 px-3.5 py-3">
            <TriangleAlert size={14} className="mt-0.5 shrink-0 text-claret" strokeWidth={2.25} />
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

      <div className="mt-8 rounded-2xl border border-hairline/60 bg-surface/50 p-4">
        <p className="eyebrow text-[9px] text-cream-faint">Where to find this</p>
        <ul className="mt-2.5 flex flex-col gap-2 text-[12.5px] text-cream-muted">
          {isFirebaseConfigured ? (
            <>
              <Hint text="Firebase console → Authentication → Users → Add user" />
              <Hint text="Enable the Email/Password provider first" />
              <Hint text="Only signed-in accounts can change prices or stock" />
            </>
          ) : (
            <>
              <Hint text="Set NEXT_PUBLIC_FIREBASE_* env vars to connect a real project" />
              <Hint text="Until then, set NEXT_PUBLIC_DEMO_STOCK_ROOM_PASSCODE to control demo access" />
              <Hint text="Demo edits are stored in this browser only" />
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow text-[9px] text-cream-faint">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3.5 py-3.5 focus-within:border-brass/60">
        {icon && <span className="text-cream-faint">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full bg-transparent font-mono text-[14px] text-cream placeholder:text-cream-faint focus:outline-none"
        />
      </div>
    </label>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass/80" />
      {text}
    </li>
  );
}
