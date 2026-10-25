"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { get, put } from "@/lib/api";

interface AdminUser { id: string; name: string; email: string; role: string; isActive: boolean; createdAt: string }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    const res = await get<{ data: { users: AdminUser[] } }>(`/api/admin/users${params}`);
    setUsers(res.data.users);
    setLoading(false);
  }, [search]);

  useEffect(() => { void load(); }, [load]);

  const toggle = async (u: AdminUser) => {
    setBusyId(u.id);
    await put(`/api/admin/users/${u.id}`, { isActive: !u.isActive }).catch(() => undefined);
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !u.isActive } : x)));
    setBusyId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Patients, doctors and admins on the platform.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" aria-label="Search users"
          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-violet-600 animate-spin" aria-hidden /></div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold text-right">Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 ${
                      u.role === "admin" ? "bg-violet-50 text-violet-700"
                      : u.role === "doctor" ? "bg-teal-50 text-teal-700"
                      : "bg-pink-50 text-pink-700"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button type="button" onClick={() => void toggle(u)} disabled={busyId === u.id || u.role === "admin"}
                      title={u.role === "admin" ? "Admins cannot be disabled" : undefined}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        u.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      } disabled:opacity-40`}>
                      {busyId === u.id ? "…" : u.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
