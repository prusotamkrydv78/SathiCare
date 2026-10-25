"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Baby, CalendarHeart, Loader2, Ruler, Sparkles, TrendingUp } from "lucide-react";
import { get, post } from "@/lib/api";

interface Current { id: string; lmpDate: string; dueDate: string; week: number; day: number; trimester: number; totalDays: number; notes: string | null }
interface Insights {
  week: number; day: number; trimester: number; dueDate: string; progressPercent: number;
  babySizeCm: number; daysToDue: number;
  weightTrend: { first: { date: string; kg: number }; last: { date: string; kg: number }; entries: number } | null;
  thisWeekTip: { weeks: string; text: string };
  dangerSigns: string[];
}
interface PLog { id: string; date: string; type: string; value: string | null; notes: string | null }

const d = (s: string) => new Date(s + (s.length === 10 ? "T00:00:00Z" : ""));

export default function PregnancyTrackerPage() {
  const [current, setCurrent] = useState<Current | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [logs, setLogs] = useState<PLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lmp, setLmp] = useState("");
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const [c, i, l] = await Promise.allSettled([
      get<{ data: Current }>("/api/pregnancy/current"),
      get<{ data: Insights }>("/api/pregnancy/insights"),
      get<{ data: { logs: PLog[] } }>("/api/pregnancy/logs"),
    ]);
    if (c.status === "fulfilled") setCurrent(c.value.data); else setCurrent(null);
    if (i.status === "fulfilled") setInsights(i.value.data);
    if (l.status === "fulfilled") setLogs(l.value.data.logs);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const start = async () => {
    if (!lmp) return;
    setBusy(true);
    try {
      await post("/api/pregnancy/start", { lmpDate: lmp, notes: null });
      flash("Pregnancy tracking started 💗");
      setLmp("");
      await load();
    } catch (e) { flash(e instanceof Error ? e.message : "Could not save"); }
    finally { setBusy(false); }
  };

  const logWeight = async () => {
    if (!weight) return;
    setBusy(true);
    try {
      await post("/api/pregnancy/log", { logType: "weight", value: weight, notes: null });
      flash("Weight logged");
      setWeight("");
      await load();
    } catch (e) { flash(e instanceof Error ? e.message : "Could not save"); }
    finally { setBusy(false); }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await post("/api/pregnancy/log", { logType: "note", value: null, notes: note });
      flash("Note saved");
      setNote("");
      await load();
    } catch (e) { flash(e instanceof Error ? e.message : "Could not save"); }
    finally { setBusy(false); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 text-accent animate-spin" aria-hidden />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pregnancy Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Follow your journey week by week.</p>
        </div>
        <section className="rounded-2xl border border-gray-100 bg-white p-6 max-w-md">
          <label htmlFor="lmp" className="block text-sm font-medium text-gray-700">
            First day of your last period (LMP)
          </label>
          <input id="lmp" type="date" value={lmp} max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setLmp(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          <p className="mt-2 text-xs text-gray-400">We calculate your due date and week from this.</p>
          <button type="button" onClick={() => void start()} disabled={!lmp || busy}
            className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-60">
            Start tracking
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white text-sm px-5 py-2.5 shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pregnancy · Week {current.week}</h1>
        <p className="text-sm text-gray-500 mt-1">Day {current.day} of the week · Trimester {current.trimester}</p>
      </div>

      <section className="rounded-2xl bg-accent text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <p className="text-white/75 text-xs uppercase tracking-wide font-semibold">Week</p>
            <p className="text-6xl font-bold leading-tight mt-1">{current.week}</p>
            <p className="text-white/80 text-sm mt-1">{current.day} day{current.day === 1 ? "" : "s"} into this week</p>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-2"><CalendarHeart className="w-4 h-4" aria-hidden /> Due {d(current.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</p>
            <p className="flex items-center gap-2"><Ruler className="w-4 h-4" aria-hidden /> Baby ≈ {insights?.babySizeCm} cm</p>
            <p className="flex items-center gap-2"><Baby className="w-4 h-4" aria-hidden /> {insights?.daysToDue} days to go</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-2.5 rounded-full bg-white/25 overflow-hidden" role="progressbar" aria-valuenow={insights?.progressPercent ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label="Pregnancy progress">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${insights?.progressPercent ?? 0}%` }} />
          </div>
          <p className="text-white/75 text-xs mt-2">{insights?.progressPercent}% of the journey · LMP {d(current.lmpDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" aria-hidden /> This week ({insights?.thisWeekTip.weeks} weeks)
          </h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{insights?.thisWeekTip.text}</p>
          {insights?.weightTrend && (
            <p className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" aria-hidden />
              Weight: {insights.weightTrend.first.kg} → {insights.weightTrend.last.kg} kg over {insights.weightTrend.entries} entries
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden /> Call your doctor immediately for
          </h2>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-700">
            {insights?.dangerSigns.map((sign) => (
              <li key={sign} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden />{sign}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Log today</h2>
          <div className="mt-4 flex gap-2">
            <input type="number" step="0.1" placeholder="Weight (kg)" value={weight}
              onChange={(e) => setWeight(e.target.value)} aria-label="Weight in kilograms"
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            <button type="button" onClick={() => void logWeight()} disabled={!weight || busy}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-60">
              Save
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <input placeholder="A note for today — symptoms, questions…" value={note}
              onChange={(e) => setNote(e.target.value)} aria-label="Daily note"
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            <button type="button" onClick={() => void saveNote()} disabled={!note.trim() || busy}
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
              Note
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Recent logs</h2>
          {logs.length ? (
            <ul className="mt-3 divide-y divide-gray-100 text-sm">
              {logs.slice(0, 6).map((l) => (
                <li key={l.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 capitalize">{l.type}{l.value ? `: ${l.value}` : ""}</p>
                    {l.notes && <p className="text-xs text-gray-500 truncate">{l.notes}</p>}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {d(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No logs yet — add your weight or a note.</p>
          )}
        </section>
      </div>
    </div>
  );
}
