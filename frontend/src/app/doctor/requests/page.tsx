"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Check, Loader2, X } from "lucide-react";
import { get, put } from "@/lib/api";

interface Appointment {
  id: string; patientName?: string | null; date: string; time: string; status: string; reason: string;
}

export default function RequestsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await get<{ data: { appointments: Appointment[] } }>("/api/appointments/doctor/mine");
      setItems(res.data.appointments.filter((a) => a.status === "pending"));
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load requests"); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const act = async (id: string, action: "accept" | "reject") => {
    setBusyId(id);
    setError(null);
    try {
      await put(`/api/appointments/${id}/${action}`, action === "reject" ? { reason: "Not available at that time" } : undefined);
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch (e) { setError(e instanceof Error ? e.message : "Action failed"); }
    finally { setBusyId(null); }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-teal-500 animate-spin" aria-hidden /></div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Appointment requests</h1>
        <p className="text-sm text-gray-500 mt-1">Accepting opens the consultation chat for both of you.</p>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{error}</p>}

      {items.length ? (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{a.patientName ?? "Patient"}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                    <CalendarDays className="w-3.5 h-3.5" aria-hidden />
                    {new Date(a.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })} · {a.time}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Reason: {a.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => void act(a.id, "accept")} disabled={busyId === a.id}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 inline-flex items-center gap-1.5">
                    {busyId === a.id ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Check className="w-4 h-4" aria-hidden />} Accept
                  </button>
                  <button type="button" onClick={() => void act(a.id, "reject")} disabled={busyId === a.id}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1.5">
                    <X className="w-4 h-4" aria-hidden /> Decline
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 px-5 py-10 text-center">
          No requests waiting. New bookings appear here instantly.
        </p>
      )}
    </div>
  );
}
