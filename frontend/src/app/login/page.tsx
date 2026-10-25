"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth, homeFor, type AuthUser } from "@/context/auth-context";

const DEMO_ACCOUNTS = [
  { label: "Sita — cycle tracking", email: "sita@demo.np" },
  { label: "Gita — pregnancy", email: "gita@demo.np" },
  { label: "Dr. Anita — doctor", email: "dr.anita@demo.np" },
  { label: "Admin", email: "admin@demo.np" },
];

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("sita@demo.np");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const u: AuthUser = await login(email, password);
      router.push(homeFor(u));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

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
          <h1 className="font-display text-3xl tracking-tight">Welcome back</h1>
          <p className="text-sm text-ink/60 mt-1.5">Your space. Only yours.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-ink/50">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" aria-hidden />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-ink/50">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" aria-hidden />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-rust bg-rust-soft border border-rust/20 rounded-xl px-3.5 py-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-ink/60 text-center mt-5">
            New here? <a href="/signup" className="font-semibold text-accent hover:underline">Create an account</a>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-5 rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sage" aria-hidden /> Demo accounts — password demo1234
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(({ label, email: demoEmail }) => {
              const active = email === demoEmail;
              return (
                <button
                  key={demoEmail}
                  type="button"
                  onClick={() => { setEmail(demoEmail); setPassword("demo1234"); setError(null); }}
                  className={`rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                    active ? "border-accent bg-accent-soft text-ink" : "border-line text-ink/70 hover:border-ink/30"
                  }`}
                >
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-ink/45 mt-0.5">{demoEmail}</span>
                </button>
              );
            })}
          </div>
        </div>

        {user && (
          <p className="mt-4 text-xs text-ink/45 text-center">
            Signed in as {user.name} — signing in again switches accounts.
          </p>
        )}
      </div>
    </main>
  );
}
