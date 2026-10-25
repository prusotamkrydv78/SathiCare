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
  { icon: CalendarHeart, title: "Your cycle, made sense of", text: "Log each period and see what's next — predicted dates, fertile windows, and patterns from your own data." },
  { icon: MessageCircleHeart, title: "Ask anything, privately", text: "Saathi answers the questions you'd hesitate to ask out loud. Real AI, real safety — danger signs go straight to real help lines." },
  { icon: Stethoscope, title: "Doctors who listen", text: "Browse doctors, book a real time slot, and chat when it's confirmed. No waiting rooms." },
  { icon: MapPin, title: "Care near you", text: "Hospitals and health posts sorted by distance, with honest reviews from other women." },
  { icon: ShieldCheck, title: "Help in one tap", text: "SOS alerts the people you trust with your location. Ambulance and helpline numbers always one tap away." },
  { icon: Baby, title: "Pregnancy, week by week", text: "Gentle weekly guidance, baby's size, and the signs that mean call your doctor now." },
];

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-line">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 h-16">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">
              <HeartPulse className="w-4 h-4" aria-hidden />
            </span>
            <span className="font-display font-semibold tracking-tight text-lg">SathiCare</span>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            {!loading && user ? (
              <Link href={homeFor(user)}
                className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-strong inline-flex items-center gap-1.5">
                Open app <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 font-medium text-ink/70 hover:text-ink">Sign in</Link>
                <Link href="/signup"
                  className="rounded-lg bg-ink px-4 py-2 font-semibold text-paper hover:bg-ink/90">
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero — editorial, quiet confidence */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-16 sm:pt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">For every girl and woman in Nepal</p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] tracking-tight mt-5 max-w-2xl">
          Your body,<br />
          your rhythm,<br />
          <span className="text-accent">your business.</span>
        </h1>
        <p className="mt-7 text-lg text-ink/70 max-w-xl leading-relaxed">
          Track your period, ask the questions you can't ask anyone else, and reach real help
          when it matters. Private to you. Free, always.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3">
          <Link href="/signup"
            className="rounded-xl bg-accent px-7 py-3.5 font-semibold text-white hover:bg-accent-strong inline-flex items-center justify-center gap-2">
            Start — it's private <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link href="/login"
            className="rounded-xl border border-line bg-white px-7 py-3.5 font-semibold text-ink hover:bg-accent-soft/60">
            Try the demo
          </Link>
        </div>
        <p className="mt-5 text-xs text-ink/45">
          No one sees your data but you. Not ads, not anyone. Demo mode — no real SMS is sent.
        </p>
      </section>

      <div className="border-t border-line" aria-hidden />

      {/* Features — editorial two-column list */}
      <section className="max-w-5xl mx-auto px-5 py-16 sm:py-24">
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight max-w-md">Everything a companion should do. Nothing it shouldn't.</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="w-10 h-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0 mt-0.5">
                <f.icon className="w-5 h-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink/65 leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Numbers strip — honest */}
      <section className="bg-ink text-paper">
        <div className="max-w-5xl mx-auto px-5 py-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { value: "18", label: "health facilities mapped near you" },
            { value: "6", label: "doctors ready to consult" },
            { value: "102 · 1115", label: "real emergency numbers, always one tap away" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl">{s.value}</p>
              <p className="text-paper/60 text-sm mt-1.5 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/45">
          <p className="font-display text-sm text-ink/70">SathiCare — care with compassion.</p>
          <p>General information only — not a substitute for professional medical care.</p>
        </div>
      </footer>
    </main>
  );
}
