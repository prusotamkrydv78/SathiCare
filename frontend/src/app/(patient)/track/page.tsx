"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Flower2,
  Loader2,
  Moon,
  RefreshCcw,
  Sun,
} from "lucide-react";
import { get, post } from "@/lib/api";

interface Cycle {
  id: string;
  startDate: string;
  endDate: string | null;
  durationDays: number | null;
  flowLevel: string;
  painLevel: number;
  notes: string | null;
}
interface CurrentData {
  cycle: Cycle | null;
  cycleDay: number;
  phase: string;
  nextPredictedStart: string;
  daysUntilNext: number;
}
interface StatsData {
  totalCycles: number;
  averageCycleLength: number;
  averagePeriodDuration: number;
  regularity: string;
}
interface PredictData {
  nextPeriodStart: string;
  daysUntilNextPeriod: number;
  ovulationDate: string;
  fertileWindow: { start: string; end: string };
  inFertileWindow: boolean;
}

const SYMPTOMS = ["Cramps", "Headache", "Fatigue", "Bloating", "Back pain", "Tender breasts", "Acne", "Mood swings", "Nausea"];
const MOODS = ["Happy", "Calm", "Neutral", "Tired", "Sad", "Anxious", "Irritable"];

const PHASES: Record<string, { label: string; icon: typeof Sun; tone: string }> = {
  menstrual: { label: "Menstrual", icon: Moon, tone: "bg-[#FFE9F0] text-[#c2446f]" },
  follicular: { label: "Follicular", icon: Sun, tone: "bg-amber-50 text-amber-700" },
  ovulation: { label: "Ovulation", icon: Flower2, tone: "bg-emerald-50 text-emerald-700" },
  luteal: { label: "Luteal", icon: Moon, tone: "bg-indigo-50 text-indigo-700" },
};

const d = (s: string) => {
  const [y, m, day] = s.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
};
const dayKey = (dt: Date) => dt.toISOString().slice(0, 10);

export default function PeriodTrackerPage() {
  const [current, setCurrent] = useState<CurrentData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [predict, setPredict] = useState<PredictData | null>(null);
  const [history, setHistory] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const [flow, setFlow] = useState("medium");
  const [pain, setPain] = useState(4);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>("Neutral");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setError(null);
    const [c, s, p, h] = await Promise.allSettled([
      get<{ data: CurrentData }>("/api/period/current"),
      get<{ data: StatsData }>("/api/period/stats"),
      get<{ data: PredictData }>("/api/period/predict"),
      get<{ data: { cycles: Cycle[] } }>("/api/period/history"),
    ]);
    if (c.status === "fulfilled") setCurrent(c.value.data);
    else setCurrent(null);
    if (s.status === "fulfilled") setStats(s.value.data);
    if (p.status === "fulfilled") setPredict(p.value.data);
    if (h.status === "fulfilled") setHistory(h.value.data.cycles);
    if (c.status === "rejected" && h.status === "rejected") setError("No period data yet — log your first period below.");
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activeCycle = current?.cycle && !current.cycle.endDate ? current.cycle : null;

  const startPeriod = async () => {
    setBusy(true);
    try {
      await post("/api/period/start", { flowLevel: flow, painLevel: pain, notes: notes || null });
      setToast("Period started — take care 💗");
      setNotes("");
      await load();
    } catch (e) { setToast(e instanceof Error ? e.message : "Could not save"); }
    finally { setBusy(false); setTimeout(() => setToast(null), 3000); }
  };

  const endPeriod = async () => {
    setBusy(true);
    try {
      await post("/api/period/end");
      setToast("Period ended");
      await load();
    } catch (e) { setToast(e instanceof Error ? e.message : "Could not save"); }
    finally { setBusy(false); setTimeout(() => setToast(null), 3000); }
  };

  const saveLog = async () => {
    setBusy(true);
    try {
      await post("/api/period/log", { symptoms, mood, notes: notes || null });
      setToast("Daily log saved ✨");
      setSymptoms([]); setNotes("");
    } catch (e) { setToast(e instanceof Error ? e.message : "Could not save"); }
    finally { setBusy(false); setTimeout(() => setToast(null), 3000); }
  };

  // Calendar marking: period days from history + predicted window
  const marks = useMemo(() => {
    const map = new Map<string, "period" | "predicted" | "future">();
    const today = new Date();
    for (const c of history) {
      const start = d(c.startDate);
      const end = c.endDate ? d(c.endDate) : (start > today ? start : today);
      for (let dt = new Date(start); dt <= end; dt.setUTCDate(dt.getUTCDate() + 1))
        map.set(dayKey(dt), "period");
    }
    if (predict) {
      const start = d(predict.nextPeriodStart);
      const dur = stats?.averagePeriodDuration ?? 5;
      for (let i = 0; i < dur; i++) {
        const dt = new Date(start); dt.setUTCDate(dt.getUTCDate() + i);
        if (!map.has(dayKey(dt))) map.set(dayKey(dt), dayKey(dt) >= dayKey(today) ? "predicted" : "future");
      }
    }
    return map;
  }, [history, predict, stats]);

  const calendar = useMemo(() => {
    const base = new Date();
    base.setUTCDate(1);
    base.setUTCMonth(base.getUTCMonth() + monthOffset);
    const year = base.getUTCFullYear();
    const month = base.getUTCMonth();
    const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells: (Date | null)[] = Array.from({ length: (firstDow + 6) % 7 }, () => null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(Date.UTC(year, month, day)));
    const label = base.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
    return { cells, label };
  }, [monthOffset]);

  const todayKey = dayKey(new Date());
  const phase = current ? PHASES[current.phase] ?? PHASES.follicular : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 text-[#FF6B9D] animate-spin" aria-hidden />
        <p className="text-sm text-gray-500">Loading your tracker…</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Period Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">Track your cycle, symptoms and predictions — all private to you.</p>
      </div>

      {error && (
        <p className="rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm px-4 py-3">{error}</p>
      )}

      {/* Current cycle + stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#f43f8e] text-white p-6 md:col-span-1">
          {current ? (
            <>
              <p className="text-white/75 text-xs uppercase tracking-wide font-semibold">Cycle day</p>
              <p className="text-6xl font-bold leading-tight mt-1">{current.cycleDay}</p>
              {phase && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mt-3 bg-white/15`}>
                  <phase.icon className="w-3.5 h-3.5" aria-hidden /> {phase.label} phase
                </span>
              )}
              <p className="text-white/80 text-xs mt-3">
                Next period in ~{current.daysUntilNext} day{current.daysUntilNext === 1 ? "" : "s"}
              </p>
            </>
          ) : (
            <>
              <p className="text-white/75 text-xs uppercase tracking-wide font-semibold">Welcome</p>
              <p className="mt-2 text-lg font-semibold leading-snug">Log your period to unlock predictions.</p>
            </>
          )}
        </section>

        {[
          { label: "Avg cycle length", value: stats ? `${stats.averageCycleLength} days` : "—", icon: RefreshCcw },
          { label: "Avg period", value: stats ? `${stats.averagePeriodDuration} days` : "—", icon: Droplets },
          { label: "Regularity", value: stats ? stats.regularity : "—", icon: Activity },
        ].map((s) => (
          <section key={s.label} className="rounded-2xl border border-gray-100 bg-white p-6">
            <s.icon className="w-5 h-5 text-[#FF6B9D]" aria-hidden />
            <p className="mt-3 text-xs uppercase tracking-wide text-gray-400 font-semibold">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-gray-900 capitalize">{s.value}</p>
          </section>
        ))}
      </div>

      {/* Actions */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-gray-900">{activeCycle ? "Period in progress" : "Log a new period"}</h2>
        {activeCycle ? (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-gray-500 flex-1">
              Started {d(activeCycle.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })} · {activeCycle.flowLevel} flow · pain {activeCycle.painLevel}/10
            </p>
            <button
              type="button"
              onClick={() => void endPeriod()}
              disabled={busy}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              End period
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="block text-xs font-medium text-gray-500 mb-1.5">Flow</span>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {["light", "medium", "heavy"].map((f) => (
                  <button key={f} type="button" onClick={() => setFlow(f)}
                    className={`flex-1 px-2 py-2 text-xs font-medium capitalize ${flow === f ? "bg-[#FF6B9D] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="pain" className="block text-xs font-medium text-gray-500 mb-1.5">Pain level: {pain}/10</label>
              <input id="pain" type="range" min={0} max={10} value={pain} onChange={(e) => setPain(Number(e.target.value))}
                className="w-full accent-[#FF6B9D]" />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={() => void startPeriod()} disabled={busy}
                className="w-full rounded-xl bg-[#FF6B9D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#f43f8e] disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />} Start period today
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Calendar */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#FF6B9D]" aria-hidden /> Calendar
          </h2>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous month" onClick={() => setMonthOffset((m) => m - 1)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <ChevronLeft className="w-4 h-4" aria-hidden />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">{calendar.label}</span>
            <button type="button" aria-label="Next month" onClick={() => setMonthOffset((m) => m + 1)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <ChevronRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((dw, i) => (
            <span key={i} className="text-[10px] font-semibold text-gray-400 py-1">{dw}</span>
          ))}
          {calendar.cells.map((dt, i) => {
            if (!dt) return <span key={`e${i}`} />;
            const key = dayKey(dt);
            const mark = marks.get(key);
            const isToday = key === todayKey;
            return (
              <span key={key} title={mark === "period" ? "Period" : mark === "predicted" ? "Predicted" : undefined}
                className={`h-9 flex items-center justify-center rounded-lg text-sm ${
                  isToday ? "ring-2 ring-[#FF6B9D] ring-offset-1 font-bold" : ""
                } ${
                  mark === "period" ? "bg-[#FF6B9D] text-white"
                  : mark === "predicted" ? "bg-[#FFE9F0] text-[#c2446f] border border-dashed border-[#FF6B9D]/50"
                  : "text-gray-700"
                }`}>
                {dt.getUTCDate()}
              </span>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF6B9D] inline-block" aria-hidden /> period</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FFE9F0] border border-dashed border-[#FF6B9D]/50 inline-block" aria-hidden /> predicted</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded ring-2 ring-[#FF6B9D] inline-block" aria-hidden /> today</span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Predictions */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Predictions</h2>
          {predict ? (
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-500">Next period</span>
                <span className="font-medium text-gray-900">
                  {d(predict.nextPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                  <span className="text-gray-400 text-xs ml-1.5">({predict.daysUntilNextPeriod}d)</span>
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-500">Fertile window</span>
                <span className="font-medium text-gray-900">
                  {d(predict.fertileWindow.start).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })} – {d(predict.fertileWindow.end).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-500">Ovulation ≈</span>
                <span className="font-medium text-gray-900">
                  {d(predict.ovulationDate).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                </span>
              </li>
              {predict.inFertileWindow && (
                <li className="rounded-xl bg-emerald-50 text-emerald-800 text-xs px-3 py-2">You are in your fertile window right now.</li>
              )}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">Predictions appear after your first logged cycle.</p>
          )}
        </section>

        {/* Daily log */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">How do you feel today?</h2>
          <div className="mt-4">
            <span className="block text-xs font-medium text-gray-500 mb-2">Symptoms</span>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOMS.map((s) => {
                const on = symptoms.includes(s);
                return (
                  <button key={s} type="button"
                    onClick={() => setSymptoms((prev) => on ? prev.filter((x) => x !== s) : [...prev, s])}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                      on ? "bg-[#FF6B9D] border-[#FF6B9D] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <span className="block text-xs font-medium text-gray-500 mb-2">Mood</span>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button key={m} type="button" onClick={() => setMood(m)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    mood === m ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="log-notes" className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
            <textarea id="log-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to remember about today…"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]" />
          </div>
          <button type="button" onClick={() => void saveLog()} disabled={busy}
            className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
            Save daily log
          </button>
        </section>
      </div>

      {/* History */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-gray-900">History</h2>
        {history.length ? (
          <ul className="mt-4 divide-y divide-gray-100">
            {history.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {d(c.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {c.durationDays ? `${c.durationDays} days` : "ongoing"} · {c.flowLevel} flow · pain {c.painLevel}/10
                  </p>
                </div>
                <span className={`text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 ${
                  c.endDate ? "bg-gray-100 text-gray-500" : "bg-[#FFE9F0] text-[#c2446f]"
                }`}>
                  {c.endDate ? "completed" : "active"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No cycles logged yet.</p>
        )}
      </section>
    </div>
  );
}
