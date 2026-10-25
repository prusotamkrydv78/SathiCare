"use client";

import { useEffect, useState } from "react";
import { KeyRound, Loader2, RefreshCcw, ShieldAlert, UserRound } from "lucide-react";
import { get, post } from "@/lib/api";

interface Account { label: string; email: string; role: string }

export default function AdminSettingsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [password, setPassword] = useState("demo1234");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await get<{ data: { password: string; accounts: Account[] } }>("/api/demo/accounts");
      setAccounts(res.data.accounts);
      setPassword(res.data.password);
    })();
  }, []);

  const reset = async () => {
    setConfirmOpen(false);
    setResetting(true);
    setMsg(null);
    try {
      await post("/api/admin/reset-demo");
      setMsg("All demo data was restored to the original seed.");
    } catch (e) { setMsg(e instanceof Error ? e.message : "Reset failed"); }
    finally { setResetting(false); }
  };

  const ROLE_STYLE: Record<string, string> = {
    admin: "bg-violet-50 text-violet-700",
    doctor: "bg-teal-50 text-teal-700",
    user: "bg-pink-50 text-pink-700",
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div role="status" className="rounded-xl bg-violet-50 border border-violet-100 text-violet-800 text-sm px-4 py-3">{msg}</div>
      )}

      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Demo mode controls and test accounts.</p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <h2 className="px-5 pt-5 pb-3 font-semibold text-gray-900 flex items-center gap-2 text-sm">
          <KeyRound className="w-4 h-4 text-violet-600" aria-hidden /> Demo accounts
        </h2>
        <ul className="divide-y divide-gray-50">
          {accounts.map((a) => (
            <li key={a.email} className="flex items-center gap-3 px-5 py-3.5">
              <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                <UserRound className="w-4 h-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{a.label}</p>
                <p className="text-xs text-gray-400 truncate">{a.email}</p>
              </div>
              <span className={`text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 ${ROLE_STYLE[a.role] ?? "bg-gray-100 text-gray-500"}`}>{a.role}</span>
            </li>
          ))}
        </ul>
        <p className="px-5 py-3 text-xs text-gray-400 border-t border-gray-50">
          Password for all accounts: <code className="bg-gray-100 rounded px-1.5 py-0.5">{password}</code>
        </p>
      </section>

      <section className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" aria-hidden /> Reset demo data
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Restores every collection — users, doctors, appointments, posts — to the original seed. Use between demos. Signed-in demo accounts stay signed in.
            </p>
          </div>
          <button type="button" onClick={() => setConfirmOpen(true)} disabled={resetting}
            className="rounded-xl border border-red-200 bg-white text-red-600 px-4 py-2.5 text-sm font-semibold hover:bg-red-50 disabled:opacity-60 inline-flex items-center gap-2 shrink-0">
            <RefreshCcw className={`w-4 h-4 ${resetting ? "animate-spin" : ""}`} aria-hidden />
            {resetting ? "Resetting…" : "Reset demo data"}
          </button>
        </div>
      </section>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm reset">
          <button type="button" aria-label="Cancel" className="absolute inset-0 bg-gray-900/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <h2 className="font-bold text-gray-900">Reset all demo data?</h2>
            <p className="text-sm text-gray-500 mt-2">
              Records created during the demo are wiped and replaced with the original seed. This cannot be undone.
            </p>
            <div className="mt-5 flex gap-2 justify-center">
              <button type="button" onClick={() => setConfirmOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Keep current data</button>
              <button type="button" onClick={() => void reset()}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Reset data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
