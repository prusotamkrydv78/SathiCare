"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, BellOff, CalendarHeart, Check, Loader2, MessageSquare, ShieldAlert, Trash2, Users } from "lucide-react";
import { get, put, del } from "@/lib/api";

interface Notif {
  id: string; type: string; title: string; message: string;
  isRead: boolean; relatedId?: string | null; createdAt: string;
}

const ICONS: Record<string, typeof Bell> = {
  appointment: CalendarHeart,
  consultation: MessageSquare,
  community: Users,
  emergency: ShieldAlert,
  system: Bell,
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = useCallback(async () => {
    const res = await get<{ data: { notifications: Notif[] } }>(`/api/notifications${filter === "unread" ? "?unread=true" : ""}`);
    setItems(res.data.notifications);
    setLoading(false);
  }, [filter]);

  useEffect(() => { void load(); }, [load]);

  const markRead = async (id: string) => {
    await put(`/api/notifications/${id}/read`).catch(() => undefined);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const readAll = async () => {
    await put("/api/notifications/read-all").catch(() => undefined);
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = async () => {
    await del("/api/notifications/clear-all").catch(() => undefined);
    setItems([]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Appointments, replies and health reminders.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 text-xs">
            {(["all", "unread"] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize ${filter === f ? "bg-[#FF6B9D] text-white" : "text-gray-600"}`}>
                {f}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => void readAll()} title="Mark all read"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
            Mark all read
          </button>
          <button type="button" onClick={() => void clearAll()} title="Clear all"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:border-red-100">
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-[#FF6B9D] animate-spin" aria-hidden /></div>
      ) : items.length ? (
        <ul className="space-y-2.5">
          {items.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <li key={n.id} className={`rounded-2xl border bg-white p-4 flex items-start gap-3.5 ${n.isRead ? "border-gray-100" : "border-[#FF6B9D]/30 bg-[#FFF5F8]"}`}>
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? "bg-gray-100 text-gray-400" : "bg-[#FFE9F0] text-[#c2446f]"}`}>
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                </div>
                {!n.isRead && (
                  <button type="button" onClick={() => void markRead(n.id)} aria-label="Mark as read"
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 shrink-0">
                    <Check className="w-4 h-4" aria-hidden />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white py-14 text-center">
          <BellOff className="w-8 h-8 text-gray-300 mx-auto" aria-hidden />
          <p className="text-sm text-gray-500 mt-3">You are all caught up.</p>
        </div>
      )}
    </div>
  );
}
