"use client";

import { useEffect, useState } from "react";
import { CalendarHeart, Flag, Loader2, MessageSquare, ShieldAlert, Users } from "lucide-react";
import { get } from "@/lib/api";

interface Stats {
  users: number; doctors: number;
  appointments: { pending: number; accepted: number; completed: number; rejected: number; cancelled: number };
  posts: number; openReports: number; sosLast7Days: number;
  recent: { type: string; text: string; createdAt: string }[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await get<{ data: Stats }>("/api/admin/stats");
        setStats(res.data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  if (loading || !stats) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-violet-600 animate-spin" aria-hidden /></div>;
  }

  const cards = [
    { label: "Patients", value: stats.users, icon: Users },
    { label: "Doctors", value: stats.doctors, icon: CalendarHeart },
    { label: "Posts", value: stats.posts, icon: MessageSquare },
    { label: "SOS (7d)", value: stats.sosLast7Days, icon: ShieldAlert },
  ];
  const attention = [
    { label: "Pending appointments", value: stats.appointments.pending, href: null, warn: stats.appointments.pending > 0 },
    { label: "Open reports", value: stats.openReports, href: "/admin/reports", warn: stats.openReports > 0 },
    { label: "Unresolved SOS", value: stats.sosLast7Days, href: "/admin/sos", warn: stats.sosLast7Days > 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Platform at a glance</h1>
        <p className="text-sm text-gray-500 mt-1">Users, doctors and community activity right now.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-5">
            <c.icon className="w-4 h-4 text-violet-600" aria-hidden />
            <p className="mt-2 text-3xl font-bold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {attention.map((a) => (
          <div key={a.label} className={`rounded-2xl border p-5 ${a.warn ? "border-amber-200 bg-amber-50/60" : "border-gray-100 bg-white"}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">{a.label}</p>
              <span className={`text-2xl font-bold ${a.warn ? "text-amber-600" : "text-gray-300"}`}>{a.value}</span>
            </div>
            {a.warn && a.href && <a href={a.href} className="mt-2 inline-block text-xs font-semibold text-amber-700 hover:underline">Review →</a>}
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Flag className="w-4 h-4 text-violet-600" aria-hidden /> Recent activity</h2>
        <ul className="mt-4 space-y-3">
          {stats.recent.map((r, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" aria-hidden />
              <span className="text-gray-600 flex-1 min-w-0 truncate">{r.text}</span>
              <span className="text-xs text-gray-400 shrink-0">{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
