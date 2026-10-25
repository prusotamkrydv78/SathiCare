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

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#FFF0F5] via-white to-[#F3E8FF]">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <span className="w-10 h-10 rounded-2xl bg-[#FF6B9D] text-white flex items-center justify-center">
            <HeartPulse className="w-5 h-5" aria-hidden />
          </span>
          <span className="font-semibold text-gray-900 text-lg">SathiCare</span>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1.5">Private, free, and yours alone.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="s-name" className="block text-sm font-medium text-gray-700">Name</label>
              <div className="relative mt-1.5">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                <input id="s-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]"
                  placeholder="Sita Kumari" />
              </div>
            </div>

            <div>
              <label htmlFor="s-email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                <input id="s-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]"
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="s-phone" className="block text-sm font-medium text-gray-700">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                <input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]"
                  placeholder="+977 98XXXXXXXX" />
              </div>
            </div>

            <div>
              <label htmlFor="s-password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                <input id="s-password" type="password" required minLength={6} value={password}
                  onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]"
                  placeholder="At least 6 characters" />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{error}</p>
            )}

            <button type="submit" disabled={busy}
              className="w-full rounded-xl bg-[#FF6B9D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#f43f8e] disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#e0447d] hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-5">
          By continuing you agree to keep this space kind and private.
        </p>
      </div>
    </main>
  );
}
