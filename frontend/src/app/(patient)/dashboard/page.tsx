"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarHeart,
  CalendarPlus,
  ChevronRight,
  Loader2,
  RefreshCcw,
  ShieldPlus,
  Sparkles,
} from "lucide-react";
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

const PHASE_COPY: Record<string, { label: string; note: string; emoji: string }> = {
  menstrual: { label: "Menstrual phase", note: "Rest, warm fluids, be gentle with yourself.", emoji: "🌙" },
  follicular: { label: "Follicular phase", note: "Energy is returning — a good week for plans.", emoji: "🌱" },
  ovulation: { label: "Ovulation window", note: "Peak energy. Fertile window is open.", emoji: "✨" },
  luteal: { label: "Luteal phase", note: "Winding down. Focus on self-care.", emoji: "🍃" },
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

  useEffect(() => {
    void load();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 text-[#FF6B9D] animate-spin" aria-hidden />
        <p className="text-sm text-gray-500">Loading your dashboard…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800"
        >
          <RefreshCcw className="w-4 h-4" aria-hidden /> Try again
        </button>
      </div>
    );
  }

  const period = data?.periodInsights;
  const pregnancy = data?.pregnancyInsights;
  const phase = period?.phase ? PHASE_COPY[period.phase] ?? PHASE_COPY.follicular : null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#f43f8e] text-white p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Namaste, {user?.name.split(" ")[0]} 👋</h1>
        <p className="mt-2 text-white/85 max-w-xl">
          Here is your wellness overview for today.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cycle card */}
        <section aria-labelledby="cycle-card" className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 id="cycle-card" className="font-semibold text-gray-900 flex items-center gap-2">
              <CalendarHeart className="w-4 h-4 text-[#FF6B9D]" aria-hidden /> Your cycle
            </h2>
            <Link href="/track" className="text-xs font-medium text-[#e0447d] hover:underline inline-flex items-center gap-1">
              Open tracker <ChevronRight className="w-3 h-3" aria-hidden />
            </Link>
          </div>
          {period && period.cycleDay ? (
            <>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-5xl font-bold text-gray-900 leading-none">{period.cycleDay}</span>
                <span className="text-sm text-gray-500 pb-1.5">
                  {period.cycleDay === 1 ? "day — cycle day 1" : `of ~29 days · ${phase?.label}`}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{phase?.emoji} {phase?.note}</p>
              <p className="mt-3 text-xs text-gray-400">
                Next period predicted in {period.daysUntilNext} day{period.daysUntilNext === 1 ? "" : "s"}
              </p>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-gray-500">No cycle data yet.</p>
              <Link
                href="/track"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#FF6B9D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f43f8e]"
              >
                <CalendarPlus className="w-4 h-4" aria-hidden /> Log your first period
              </Link>
            </div>
          )}
        </section>

        {/* Pregnancy card */}
        <section aria-labelledby="pregnancy-card" className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 id="pregnancy-card" className="font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6B9D]" aria-hidden /> Pregnancy
          </h2>
          {pregnancy ? (
            <>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-5xl font-bold text-gray-900 leading-none">{pregnancy.week}</span>
                <span className="text-sm text-gray-500 pb-1.5">weeks {pregnancy.day}d · trimester {pregnancy.trimester}</span>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Due {new Date(pregnancy.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
              <Link href="/pregnancy-tracker" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#e0447d] hover:underline">
                Open pregnancy tracker <ChevronRight className="w-3 h-3" aria-hidden />
              </Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Not tracking a pregnancy. Start anytime from the pregnancy tracker.
            </p>
          )}
        </section>

        {/* Appointments */}
        <section aria-labelledby="appts-card" className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 id="appts-card" className="font-semibold text-gray-900">Upcoming appointments</h2>
            <Link href="/consultations" className="text-xs font-medium text-[#e0447d] hover:underline inline-flex items-center gap-1">
              All <ChevronRight className="w-3 h-3" aria-hidden />
            </Link>
          </div>
          {data?.upcomingAppointments?.length ? (
            <ul className="mt-4 space-y-3">
              {data.upcomingAppointments.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.doctorName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {a.time}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 shrink-0 ${
                    a.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {a.status === "accepted" ? "Confirmed" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No upcoming appointments.</p>
          )}
        </section>

        {/* Notifications */}
        <section aria-labelledby="notif-card" className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 id="notif-card" className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF6B9D]" aria-hidden /> Notifications
              {(data?.unreadNotifications ?? 0) > 0 && (
                <span className="text-[10px] font-bold bg-[#FF6B9D] text-white rounded-full px-1.5 py-0.5">
                  {data?.unreadNotifications}
                </span>
              )}
            </h2>
            <Link href="/notifications" className="text-xs font-medium text-[#e0447d] hover:underline inline-flex items-center gap-1">
              All <ChevronRight className="w-3 h-3" aria-hidden />
            </Link>
          </div>
          {data?.recentNotifications?.length ? (
            <ul className="mt-4 space-y-3">
              {data.recentNotifications.slice(0, 3).map((n) => (
                <li key={n.id} className="flex items-start gap-2.5">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.isRead ? "bg-gray-300" : "bg-[#FF6B9D]"}`} aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">You are all caught up.</p>
          )}
        </section>
      </div>

      {/* Emergency strip */}
      <Link
        href="/emergency"
        className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors p-4 sm:p-5 group"
      >
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
            <ShieldPlus className="w-5 h-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">Need help now?</p>
            <p className="text-xs text-gray-500">Open SOS to alert your emergency contacts instantly</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" aria-hidden />
      </Link>
    </div>
  );
}
