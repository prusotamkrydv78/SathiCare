"use client";

import { useCallback, useEffect, useState } from "react";
import { EyeOff, Flag, Loader2, X } from "lucide-react";
import { get, put } from "@/lib/api";

interface Report { id: string; postId: string; postExcerpt: string; reason: string; status: string; createdAt: string }

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await get<{ data: { reports: Report[] } }>("/api/admin/reports");
    setReports(res.data.reports);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const act = async (id: string, action: "hide" | "dismiss") => {
    setBusyId(id);
    await put(`/api/admin/reports/${id}`, { action }).catch(() => undefined);
    setReports((prev) => prev.filter((r) => r.id !== id));
    setBusyId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reported posts</h1>
        <p className="text-sm text-gray-500 mt-1">Community reports waiting for review.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-violet-600 animate-spin" aria-hidden /></div>
      ) : reports.length ? (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Flag className="w-4 h-4" aria-hidden />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 italic">&ldquo;{r.postExcerpt}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-1.5">Reason: {r.reason} · {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => void act(r.id, "hide")} disabled={busyId === r.id}
                    className="rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 inline-flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5" aria-hidden /> Hide post
                  </button>
                  <button type="button" onClick={() => void act(r.id, "dismiss")} disabled={busyId === r.id}
                    className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" aria-hidden /> Dismiss
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 px-5 py-10 text-center">
          No open reports — the community is kind today.
        </p>
      )}
    </div>
  );
}
