"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, Clock, Inbox, Loader2, MessageSquare, X } from "lucide-react";
import { get, put } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface Appointment {
  id: string; patientId: string; patientName?: string | null; doctorName?: string | null;
  date: string; time: string; status: string; reason: string;
  notes?: string | null; prescription?: string | null; rejectionReason?: string | null;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await get<{ data: { appointments: Appointment[] } }>("/api/appointments/doctor/mine");
      setAppointments(res.data.appointments);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load appointments"); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const act = async (id: string, action: "accept" | "reject") => {
    setBusyId(id);
    setError(null);
    try {
      const { put: doPut } = await import("@/lib/api");
      await doPut(`/api/appointments/${id}/${action}`, action === "reject" ? { reason: "Not available at that time" } : undefined);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Action failed"); }
    finally { setBusyId(null); }
  };

  const pending = appointments.filter((a) => a.status === "pending");
  const upcoming = appointments.filter((a) => a.status === "accepted" && a.date >= new Date().toISOString().slice(0, 10));
  const completed = appointments.filter((a) => a.status === "completed");

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-teal-500 animate-spin" aria-hidden /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending requests", value: pending.length, icon: Inbox, href: "/doctor/requests" },
          { label: "Upcoming", value: upcoming.length, icon: Clock, href: "/doctor/appointments" },
          { label: "Completed", value: completed.length, icon: Check, href: "/doctor/appointments" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-teal-200">
            <s.icon className="w-4 h-4 text-teal-600" aria-hidden />
            <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Link>
        ))}
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{error}</p>}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pending requests</h2>
          {pending.length > 0 && (
            <span className="text-[10px] font-bold bg-teal-600 text-white rounded-full px-2 py-0.5">{pending.length} new</span>
          )}
        </div>
        {pending.length ? (
          <ul className="mt-3 space-y-3">
            {pending.map((a) => (
              <li key={a.id} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{a.patientName ?? "Patient"}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <CalendarDays className="w-3.5 h-3.5" aria-hidden />
                      {new Date(a.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" })} · {a.time}
                    </p>
                    <p className="text-sm text-gray-600 mt-1.5">Reason: {a.reason}</p>
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
          <p className="mt-3 text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 px-5 py-6 text-center">
            No pending requests right now.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-gray-900">Next consultations</h2>
        {upcoming.length ? (
          <ul className="mt-3 space-y-3">
            {upcoming.slice(0, 3).map((a) => (
              <li key={a.id} className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{a.patientName ?? "Patient"}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })} · {a.time} · {a.reason}
                  </p>
                </div>
                <Link href={`/consultations/${a.id}/chat`}
                  className="rounded-xl bg-[#FF6B9D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f43f8e] inline-flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" aria-hidden /> Open chat
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-400">No upcoming consultations.</p>
        )}
      </section>
    </div>
  );
}
