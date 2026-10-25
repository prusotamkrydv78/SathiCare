"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, Loader2, MessageSquare, Search } from "lucide-react";
import { get, put } from "@/lib/api";

interface Appointment {
  id: string; patientName?: string | null; date: string; time: string; status: string; reason: string;
  notes?: string | null; prescription?: string | null; rejectionReason?: string | null;
}

const TABS = ["all", "pending", "accepted", "completed", "rejected", "cancelled"] as const;

export default function DoctorAppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [search, setSearch] = useState("");
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [rx, setRx] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await get<{ data: { appointments: Appointment[] } }>("/api/appointments/doctor/mine");
      setItems(res.data.appointments);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load"); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openComplete = (a: Appointment) => {
    setCompleteId(a.id);
    setNotes(a.notes ?? "");
    setRx(a.prescription ?? "");
  };

  const submitComplete = async () => {
    if (!completeId || !notes.trim()) return;
    setBusy(true);
    try {
      await put(`/api/appointments/${completeId}/complete`, { notes: notes.trim(), prescription: rx.trim() || null });
      setCompleteId(null);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save"); }
    finally { setBusy(false); }
  };

  const filtered = items
    .filter((a) => (tab === "all" ? true : a.status === tab))
    .filter((a) => !search.trim() || (a.patientName ?? "").toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-teal-500 animate-spin" aria-hidden /></div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">All appointments</h1>
        <p className="text-sm text-gray-500 mt-1">Every booking with you, newest first.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient…" aria-label="Search patients"
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border capitalize ${
                tab === t ? "bg-teal-600 border-teal-600 text-white" : "border-gray-200 bg-white text-gray-600"
              }`}>
              {t} {t !== "all" && items.filter((a) => a.status === t).length > 0 && `(${items.filter((a) => a.status === t).length})`}
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{error}</p>}

      {filtered.length ? (
        <ul className="space-y-3">
          {filtered.map((a) => (
            <li key={a.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{a.patientName ?? "Patient"}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })} · {a.time}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Reason: {a.reason}</p>
                  {a.notes && <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-3 py-1.5">📝 {a.notes}</p>}
                  {a.prescription && <p className="text-xs text-gray-500 mt-1">💊 {a.prescription}</p>}
                </div>
                <div className="flex flex-col gap-2 items-stretch min-w-[120px]">
                  <span className={`text-[10px] font-semibold uppercase rounded-full px-2.5 py-1 text-center ${
                    a.status === "accepted" ? "bg-emerald-50 text-emerald-700"
                    : a.status === "pending" ? "bg-amber-50 text-amber-700"
                    : a.status === "completed" ? "bg-indigo-50 text-indigo-700"
                    : a.status === "rejected" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
                  }`}>{a.status}</span>
                  {a.status === "accepted" && (
                    <>
                      <Link href={`/consultations/${a.id}/chat`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-strong">
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden /> Chat
                      </Link>
                      <button type="button" onClick={() => openComplete(a)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-700">
                        <ClipboardCheck className="w-3.5 h-3.5" aria-hidden /> Complete
                      </button>
                    </>
                  )}
                  {a.status === "completed" && (
                    <button type="button" onClick={() => openComplete(a)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                      Edit notes
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 text-center py-10">Nothing here.</p>
      )}

      {completeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Complete consultation">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-gray-900/40" onClick={() => setCompleteId(null)} />
          <form className="relative bg-white rounded-2xl w-full max-w-md p-6" onSubmit={(e) => { e.preventDefault(); void submitComplete(); }}>
            <h2 className="font-bold text-gray-900">Consultation notes</h2>
            <p className="text-xs text-gray-400 mt-1">Shared with the patient and kept in their record.</p>
            <label htmlFor="d-notes" className="block text-xs font-medium text-gray-500 mt-4 mb-1.5">Notes *</label>
            <textarea id="d-notes" rows={4} required value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Findings, advice, follow-up plan…"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <label htmlFor="d-rx" className="block text-xs font-medium text-gray-500 mt-3 mb-1.5">Prescription (optional)</label>
            <textarea id="d-rx" rows={2} value={rx} onChange={(e) => setRx(e.target.value)}
              placeholder="Medicines, dosage, duration…"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <div className="mt-5 flex gap-2 justify-end">
              <button type="button" onClick={() => setCompleteId(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={!notes.trim() || busy}
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 inline-flex items-center gap-2">
                {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />} Mark complete
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
