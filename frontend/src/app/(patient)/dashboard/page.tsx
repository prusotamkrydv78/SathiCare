"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarPlus, ChevronRight, Loader2, RefreshCcw, ShieldPlus, Sparkles } from "lucide-react";
import { get } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface DashData {
  user: { name: string; language: string };
  periodInsights: { hasData?: boolean; cycleDay?: number; phase?: string; nextPredictedStart?: string; daysUntilNext?: number };
  pregnancyInsights: { active: boolean; week: number; day: number; trimester: number; dueDate: string } | null;
  upcomingAppointments: { id: string; doctorName: string; specialization: string; date: string; time: string; status: string }[];
  recentNotifications: { id: string; title: string; message: string; isRead: boolean; createdAt: string }[];
  unreadNotifications: number;
}

const PHASE_COPY: Record<string, string> = {
  menstrual: "Be gentle with yourself today. Warm drinks help.",
  follicular: "Energy is returning — a good week for plans.",
  ovulation: "Peak energy. Your fertile window is open.",
  luteal: "Winding down. Rest is productive too.",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get<{ data: DashData }>("/api/dashboard");
      setData(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  if (loading && !data) {
    return <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 text-accent animate-spin" aria-hidden /></div>;
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 text-center">
        <p className="text-sm text-ink/70">{error}</p>
        <button type="button" onClick={() => void load()}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <RefreshCcw className="w-4 h-4" aria-hidden /> Try again
        </button>
      </div>
    );
  }

  const period = data?.periodInsights;
  const pregnancy = data?.pregnancyInsights;
  const nextAppt = data?.upcomingAppointments?.[0];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <p className="text-xs text-ink/45">{today}</p>
        <h1 className="font-display text-3xl tracking-tight mt-0.5">Hi, {user?.name.split(" ")[0]}</h1>
      </div>

      {/* Cycle hero card */}
      {period?.cycleDay ? (
        <section className="rounded-2xl bg-ink text-paper p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-paper/50">Cycle day</p>
              <p className="font-display text-6xl leading-none mt-1.5">{period.cycleDay}</p>
            </div>
            <div className="text-right pb-1">
              <p className="text-sm font-medium capitalize">{period.phase} phase</p>
              <p className="text-xs text-paper/55 mt-0.5">
                Next period in ~{period.daysUntilNext} day{period.daysUntilNext === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <p className="text-xs text-paper/60 mt-4 leading-relaxed">{PHASE_COPY[period.phase ?? ""] ?? ""}</p>
          <Link href="/track" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-paper underline underline-offset-4 decoration-paper/30 hover:decoration-paper">
            Open tracker <ChevronRight className="w-4 h-4" aria-hidden />
          </Link>
        </section>
      ) : (
        <section className="rounded-2xl border border-line bg-white p-6">
          <p className="font-display text-2xl tracking-tight">Start with one log.</p>
          <p className="text-sm text-ink/60 mt-1.5">Log your period once — predictions and patterns come from there.</p>
          <Link href="/track" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            <CalendarPlus className="w-4 h-4" aria-hidden /> Log my first period
          </Link>
        </section>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/ai-chat", label: "Ask Saathi", icon: Sparkles },
          { href: "/consultations", label: "Book doctor", icon: CalendarPlus },
          { href: "/emergency", label: "SOS", icon: ShieldPlus },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 active:scale-[0.97] transition-transform ${
              label === "SOS" ? "border-rust/25 bg-rust-soft text-rust" : "border-line bg-white text-accent"
            }`}>
            <Icon className="w-5 h-5" aria-hidden />
            <span className="text-[11px] font-semibold">{label}</span>
          </Link>
        ))}
      </div>

      {/* Pregnancy */}
      {pregnancy && (
        <Link href="/pregnancy-tracker" className="block rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/45">Pregnancy · week</p>
              <p className="font-display text-4xl mt-0.5">{pregnancy.week}<span className="text-lg text-ink/40"> w {pregnancy.day}d</span></p>
            </div>
            <div className="text-right text-xs text-ink/55">
              <p>Trimester {pregnancy.trimester}</p>
              <p className="mt-1">Due {new Date(pregnancy.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</p>
            </div>
          </div>
        </Link>
      )}

      {/* Next appointment */}
      {nextAppt ? (
        <Link href="/consultations" className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-ink/45">Next appointment</p>
            <p className="text-sm font-semibold mt-1 truncate">{nextAppt.doctorName}</p>
            <p className="text-xs text-ink/55 mt-0.5">
              {new Date(nextAppt.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })} · {nextAppt.time} · {nextAppt.specialization}
            </p>
          </div>
          <span className={`text-[10px] font-semibold uppercase rounded-full px-2.5 py-1 ${
            nextAppt.status === "accepted" ? "bg-sage-soft text-sage" : "bg-warn-soft text-warn"
          }`}>
            {nextAppt.status === "accepted" ? "Confirmed" : "Pending"}
          </span>
        </Link>
      ) : (
        <Link href="/consultations" className="flex items-center justify-between rounded-2xl border border-dashed border-line bg-white/60 p-5">
          <p className="text-sm text-ink/60">No appointments — book a doctor when you're ready.</p>
          <ChevronRight className="w-4 h-4 text-ink/30" aria-hidden />
        </Link>
      )}

      {/* Notifications preview */}
      {data?.recentNotifications?.length ? (
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-wide text-ink/45">Recent</p>
            {(data.unreadNotifications ?? 0) > 0 && (
              <span className="text-[10px] font-bold bg-accent text-white rounded-full px-1.5 py-0.5">{data.unreadNotifications}</span>
            )}
          </div>
          <ul className="mt-3 space-y-3">
            {data.recentNotifications.slice(0, 3).map((n) => (
              <li key={n.id} className="flex items-start gap-2.5">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.isRead ? "bg-ink/15" : "bg-accent"}`} aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{n.title}</p>
                  <p className="text-xs text-ink/50 line-clamp-1 mt-0.5">{n.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
