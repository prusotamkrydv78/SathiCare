"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, MapPin, Siren } from "lucide-react";
import { get, put } from "@/lib/api";

interface Alert {
  id: string; userName: string;
  location: { latitude?: number | null; longitude?: number | null; label?: string | null };
  status: string; createdAt: string; resolvedAt?: string | null;
}

export default function AdminSosPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await get<{ data: { alerts: Alert[] } }>("/api/admin/sos");
    setAlerts(res.data.alerts);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const resolve = async (id: string) => {
    setBusyId(id);
    await put(`/api/admin/sos/${id}/resolve`).catch(() => undefined);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "resolved", resolvedAt: new Date().toISOString() } : a)));
    setBusyId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">SOS alerts</h1>
        <p className="text-sm text-gray-500 mt-1">Emergency triggers, newest first. Resolve once handled.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-violet-600 animate-spin" aria-hidden /></div>
      ) : alerts.length ? (
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li key={a.id} className={`rounded-2xl border p-5 ${a.status === "active" ? "border-red-200 bg-red-50/50" : "border-gray-100 bg-white"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.status === "active" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}>
                    <Siren className="w-4 h-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{a.userName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" aria-hidden />
                      {a.location.label ?? "No location"}
                      {a.location.latitude != null && (
                        <a className="text-violet-600 hover:underline"
                          href={`https://www.openstreetmap.org/?mlat=${a.location.latitude}&mlon=${a.location.longitude}#map=16/${a.location.latitude}/${a.location.longitude}`}
                          target="_blank" rel="noreferrer">map ↗</a>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                  </div>
                </div>
                {a.status === "active" ? (
                  <button type="button" onClick={() => void resolve(a.id)} disabled={busyId === a.id}
                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 inline-flex items-center gap-1.5">
                    {busyId === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> : <Check className="w-3.5 h-3.5" aria-hidden />} Resolve
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold uppercase rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1">resolved</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 px-5 py-10 text-center">No SOS alerts recorded.</p>
      )}
    </div>
  );
}
