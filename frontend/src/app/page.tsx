"use client";

import Link from "next/link";
import {
  ArrowRight,
  Baby,
  CalendarHeart,
  HeartPulse,
  MapPin,
  MessageCircleHeart,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useAuth, homeFor } from "@/context/auth-context";

const FEATURES = [
  { icon: CalendarHeart, title: "Period tracker", text: "Log your cycle, see predictions for your next period and fertile window — computed from your own data." },
  { icon: Baby, title: "Pregnancy companion", text: "Week-by-week guidance, baby size, danger signs to watch, and a due-date countdown." },
  { icon: MessageCircleHeart, title: "Saathi AI", text: "Ask any question, in your words. Danger signs get an instant escalation to real help lines." },
  { icon: Stethoscope, title: "Doctor consultations", text: "Browse verified doctors, book real time slots, and chat privately once confirmed." },
  { icon: MapPin, title: "Find care near you", text: "Hospitals and health posts sorted by distance, with honest reviews from other women." },
  { icon: ShieldCheck, title: "One-tap SOS", text: "Alert your emergency contacts with your location instantly — plus ambulance and helpline numbers." },
];

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#FF6B9D] text-white flex items-center justify-center">
              <HeartPulse className="w-5 h-5" aria-hidden />
            </span>
            <span className="font-semibold text-gray-900">SathiCare</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3 text-sm">
            {!loading && user ? (
              <Link href={homeFor(user)}
                className="rounded-xl bg-[#FF6B9D] px-4 py-2 font-semibold text-white hover:bg-[#f43f8e] inline-flex items-center gap-1.5">
                Open app <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
                <Link href="/signup"
                  className="rounded-xl bg-[#FF6B9D] px-4 py-2 font-semibold text-white hover:bg-[#f43f8e]">
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F5] via-white to-[#F3E8FF]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B9D]" aria-hidden />
            Made for women in Nepal · नमस्ते
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
            Your health,<br />
            <span className="bg-gradient-to-r from-[#FF6B9D] to-[#7C3AED] bg-clip-text text-transparent">understood and cared for</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track your cycle, follow your pregnancy, ask Saathi AI anything, and reach a real doctor —
            privately, in your language, from Janakpur to Kathmandu.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup"
              className="rounded-2xl bg-[#FF6B9D] px-7 py-3.5 font-semibold text-white hover:bg-[#f43f8e] shadow-lg shadow-[#FF6B9D]/25 inline-flex items-center justify-center gap-2">
              Start free <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link href="/login"
              className="rounded-2xl border border-gray-200 bg-white px-7 py-3.5 font-semibold text-gray-700 hover:bg-gray-50">
              Try the demo
            </Link>
          </div>
          <p className="mt-5 text-xs text-gray-400">
            Demo mode · private · no real SMS is sent · emergency numbers 102 / 1115
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Everything in one companion</h2>
        <p className="text-center text-gray-500 mt-3 max-w-xl mx-auto">
          Built feature by feature with real flows — every screen works with real data.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-lg hover:shadow-gray-100 transition-shadow">
              <span className="w-11 h-11 rounded-2xl bg-[#FFE9F0] text-[#c2446f] flex items-center justify-center">
                <f.icon className="w-5 h-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honest stats strip */}
      <section className="bg-gradient-to-r from-[#FF6B9D] to-[#7C3AED] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { value: "18", label: "health facilities mapped around you" },
            { value: "6", label: "verified demo doctors ready to chat" },
            { value: "102 / 1115", label: "real emergency numbers, always one tap away" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-white/75 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>SathiCare — care with compassion.</p>
          <p>General information only — not a substitute for professional medical care.</p>
        </div>
      </footer>
    </main>
  );
}
