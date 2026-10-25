"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Loader2, Lock, Mail, ShieldCheck, Stethoscope } from "lucide-react";
import { useAuth, homeFor, type AuthUser } from "@/context/auth-context";

const DEMO_ACCOUNTS = [
  { label: "Patient", email: "sita@demo.np", icon: HeartPulse },
  { label: "Pregnant", email: "gita@demo.np", icon: HeartPulse },
  { label: "Doctor", email: "dr.anita@demo.np", icon: Stethoscope },
  { label: "Admin", email: "admin@demo.np", icon: ShieldCheck },
];

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("sita@demo.np");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e?: React.FormEvent, overrideEmail?: string) => {
    e?.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const u: AuthUser = await login(overrideEmail ?? email, password);
      router.push(homeFor(u));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand panel */}
      <section className="lg:w-[45%] bg-gradient-to-br from-[#FF6B9D] via-[#f43f8e] to-[#7C3AED] text-white flex flex-col justify-between p-8 sm:p-12">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <HeartPulse className="w-6 h-6" aria-hidden />
          </span>
          <div>
            <p className="font-bold text-lg leading-tight">SathiCare</p>
            <p className="text-white/75 text-xs">Your health companion</p>
          </div>
        </div>

        <div className="py-10 max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
            Care that understands you.
          </h1>
          <p className="mt-4 text-white/85 leading-relaxed">
            Track your cycle, follow your pregnancy week by week, ask Saathi AI anything, and
            reach a doctor — privately, in your language.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/90">
            {[
              "Period & pregnancy tracking with predictions",
              "Saathi AI with danger-sign alerts",
              "Real doctor consultations with live chat",
              "One-tap SOS with your emergency contacts",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/60 text-xs">
          Demo mode · data is for demonstration only
        </p>
      </section>

      {/* Form panel */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
              Demo
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1.5">
            Pick a demo account, or sign in with any of them — password is{" "}
            <code className="text-xs bg-gray-100 rounded px-1.5 py-0.5">demo1234</code>.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {DEMO_ACCOUNTS.map(({ label, email: demoEmail, icon: Icon }) => {
              const active = email === demoEmail;
              return (
                <button
                  key={demoEmail}
                  type="button"
                  onClick={() => {
                    setEmail(demoEmail);
                    setPassword("demo1234");
                    setError(null);
                  }}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B9D] ${
                    active
                      ? "border-[#FF6B9D] bg-[#FF6B9D]/5 text-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#FF6B9D] shrink-0" aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-medium">{label}</span>
                    <span className="block text-[11px] text-gray-400 truncate">{demoEmail}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-[#FF6B9D]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B9D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#f43f8e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B9D] focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {user && (
            <p className="mt-4 text-xs text-gray-400 text-center">
              Already signed in as {user.name} — signing in again switches accounts.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
