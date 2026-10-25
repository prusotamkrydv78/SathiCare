"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartPulse, Loader2, Lock, Mail, Phone, UserRound } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      await signup(name, email, password, phone || undefined);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account");
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full rounded-xl border border-line bg-paper pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent";
  const label = "block text-xs font-semibold uppercase tracking-wide text-ink/50";

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <span className="w-9 h-9 rounded-lg bg-accent text-white flex items-center justify-center">
            <HeartPulse className="w-5 h-5" aria-hidden />
          </span>
          <span className="font-display font-semibold text-xl tracking-tight">SathiCare</span>
        </div>

        <div className="rounded-2xl border border-line bg-white p-7">
          <h1 className="font-display text-3xl tracking-tight">Your body, your pace.</h1>
          <p className="text-sm text-ink/60 mt-1.5">A private space — free, and yours alone.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="s-name" className={label}>Name</label>
              <div className="relative mt-1.5">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" aria-hidden />
                <input id="s-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field}
                  placeholder="Your name" />
              </div>
            </div>

            <div>
              <label htmlFor="s-email" className={label}>Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" aria-hidden />
                <input id="s-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field}
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="s-phone" className={label}>Phone <span className="normal-case font-normal text-ink/40">(optional)</span></label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" aria-hidden />
                <input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={field}
                  placeholder="+977 98…" />
              </div>
            </div>

            <div>
              <label htmlFor="s-password" className={label}>Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" aria-hidden />
                <input id="s-password" type="password" required minLength={6} value={password}
                  onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className={field}
                  placeholder="At least 6 characters" />
              </div>
            </div>

            {error && <p role="alert" className="text-sm text-rust bg-rust-soft border border-rust/20 rounded-xl px-3.5 py-2.5">{error}</p>}

            <button type="submit" disabled={busy}
              className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              {busy ? "Creating…" : "Create my account"}
            </button>
          </form>

          <p className="text-sm text-ink/60 text-center mt-5">
            Already have one? <Link href="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-[11px] text-ink/45 text-center mt-5 leading-relaxed">
          We keep this space kind and private. Your data stays yours — delete your account anytime from Profile.
        </p>
      </div>
    </main>
  );
}
