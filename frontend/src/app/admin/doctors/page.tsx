"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Search, Star } from "lucide-react";
import { get, post, put } from "@/lib/api";

interface Doctor {
  id: string; name: string; email: string; specialization: string;
  experienceYears: number; fee: number; available: boolean; ratingAverage: number; ratingCount: number;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("Gynecologist");
  const [experience, setExperience] = useState("5");
  const [fee, setFee] = useState("1000");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    const res = await get<{ data: { doctors: Doctor[] } }>(`/api/admin/doctors${params}`);
    setDoctors(res.data.doctors);
    setLoading(false);
  }, [search]);

  useEffect(() => { void load(); }, [load]);

  const add = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await post<{ message: string }>("/api/admin/doctors", {
        name, email, specialization, experienceYears: Number(experience) || 1,
        consultationFee: Number(fee) || 500, languages: "Nepali, English",
      });
      setMsg(res.message);
      setShowAdd(false);
      setName(""); setEmail("");
      await load();
    } catch (e) { setMsg(e instanceof Error ? e.message : "Could not add"); }
    finally { setBusy(false); }
  };

  const toggle = async (d: Doctor) => {
    await put(`/api/admin/doctors/${d.id}`, { available: !d.available }).catch(() => undefined);
    setDoctors((prev) => prev.map((x) => (x.id === d.id ? { ...x, available: !x.available } : x)));
  };

  return (
    <div className="space-y-5">
      {msg && (
        <div role="status" className="rounded-xl bg-violet-50 border border-violet-100 text-violet-800 text-sm px-4 py-3 flex items-center justify-between">
          {msg}
          <button type="button" onClick={() => setMsg(null)} aria-label="Dismiss" className="text-violet-400 hover:text-violet-700">✕</button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">New doctors get a login with password demo1234.</p>
        </div>
        <button type="button" onClick={() => setShowAdd((s) => !s)}
          className="rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 inline-flex items-center gap-2">
          <Plus className="w-4 h-4" aria-hidden /> Add doctor
        </button>
      </div>

      {showAdd && (
        <section className="rounded-2xl border border-violet-100 bg-white p-5">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); void add(); }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Full Name" required aria-label="Doctor name"
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@demo.np" required type="email" aria-label="Doctor email"
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} aria-label="Specialization"
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              {["Gynecologist", "Obstetrician", "General Physician", "Pediatrician", "Psychiatrist", "Nutritionist"].map((s) => <option key={s}>{s}</option>)}
            </select>
            <div className="flex gap-3">
              <input value={experience} onChange={(e) => setExperience(e.target.value)} type="number" placeholder="Years" aria-label="Experience years"
                className="w-1/2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <input value={fee} onChange={(e) => setFee(e.target.value)} type="number" placeholder="Fee" aria-label="Consultation fee"
                className="w-1/2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <button type="submit" disabled={busy || !name || !email}
              className="sm:col-span-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-50 inline-flex items-center justify-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />} Add doctor + create login
            </button>
          </form>
        </section>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors…" aria-label="Search doctors"
          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-violet-600 animate-spin" aria-hidden /></div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Doctor</th>
                <th className="px-5 py-3 font-semibold">Rating</th>
                <th className="px-5 py-3 font-semibold">Fee</th>
                <th className="px-5 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.specialization} · {d.experienceYears} yrs · {d.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden />
                      {d.ratingAverage.toFixed(1)} <span className="text-gray-400 font-normal">({d.ratingCount})</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">NPR {d.fee}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button type="button" onClick={() => void toggle(d)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        d.available ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      {d.available ? "Available" : "Off duty"}
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
