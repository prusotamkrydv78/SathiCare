"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Droplets, Loader2, Ruler, Save, Scale, UserRound } from "lucide-react";
import { get, put } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface ProfileData {
  id: string; name: string; email: string; phone?: string | null; language: string;
  healthProfile?: {
    age?: number | null; bloodGroup?: string | null; heightCm?: number | null; weightKg?: number | null;
    conditions?: string[]; allergies?: string[]; lastPeriodDate?: string | null; notes?: string | null;
  } | null;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COMMON_CONDITIONS = ["PCOS", "Thyroid", "Diabetes", "Anemia", "Hypertension", "Asthma", "None"];

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("english");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await get<{ data: ProfileData }>("/api/user/profile");
    setData(res.data);
    setName(res.data.name);
    setPhone(res.data.phone ?? "");
    setLanguage(res.data.language);
    const hp = res.data.healthProfile;
    setAge(hp?.age?.toString() ?? "");
    setBloodGroup(hp?.bloodGroup ?? "");
    setHeightCm(hp?.heightCm?.toString() ?? "");
    setWeightKg(hp?.weightKg?.toString() ?? "");
    setConditions(hp?.conditions ?? []);
    setNotes(hp?.notes ?? "");
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const flash = (m: string) => { setSaved(m); setTimeout(() => setSaved(null), 2500); };

  const saveBasic = async () => {
    setSaving(true);
    try {
      await put("/api/user/profile", { name, phone: phone || null, language });
      await refreshUser();
      flash("Profile saved");
    } catch (e) { flash(e instanceof Error ? e.message : "Could not save"); }
    finally { setSaving(false); }
  };

  const saveHealth = async () => {
    setSaving(true);
    try {
      await put("/api/user/health-profile", {
        age: age ? Number(age) : null,
        bloodGroup: bloodGroup || null,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        conditions,
        allergies: [],
        lastPeriodDate: null,
        notes: notes || null,
      });
      flash("Health details saved");
    } catch (e) { flash(e instanceof Error ? e.message : "Could not save"); }
    finally { setSaving(false); }
  };

  if (loading || !data) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-accent animate-spin" aria-hidden /></div>;
  }

  return (
    <div className="space-y-5">
      {saved && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white text-sm px-5 py-2.5 shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" aria-hidden /> {saved}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Your details stay private to your account.</p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center font-bold text-lg">
            {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </span>
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-400">{data.email}</p>
          </div>
          <UserRound className="w-5 h-5 text-gray-200 ml-auto" aria-hidden />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="p-name" className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
            <input id="p-name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label htmlFor="p-phone" className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
            <input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 98…"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label htmlFor="p-lang" className="block text-xs font-medium text-gray-500 mb-1.5">Language</label>
            <select id="p-lang" value={language} onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="english">English</option>
              <option value="nepali">नेपाली (Nepali)</option>
              <option value="maithili">Maithili</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>
        </div>
        <button type="button" onClick={() => void saveBasic()} disabled={saving}
          className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-60 inline-flex items-center gap-2">
          <Save className="w-4 h-4" aria-hidden /> Save profile
        </button>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Health details</h2>
        <p className="text-xs text-gray-400 mt-0.5">Helps Saathi AI and doctors give you better guidance.</p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="h-age" className="block text-xs font-medium text-gray-500 mb-1.5">Age</label>
            <input id="h-age" type="number" value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label htmlFor="h-blood" className="block text-xs font-medium text-gray-500 mb-1.5">Blood group</label>
            <select id="h-blood" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">—</option>
              {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="h-height" className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Ruler className="w-3 h-3" aria-hidden /> Height (cm)</label>
            <input id="h-height" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label htmlFor="h-weight" className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Scale className="w-3 h-3" aria-hidden /> Weight (kg)</label>
            <input id="h-weight" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>

        <div className="mt-4">
          <span className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1"><Droplets className="w-3 h-3" aria-hidden /> Conditions</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_CONDITIONS.map((c) => {
              const on = conditions.includes(c);
              return (
                <button key={c} type="button"
                  onClick={() => setConditions((prev) => on ? prev.filter((x) => x !== c) : [...prev, c])}
                  className={`rounded-full px-3 py-1 text-xs font-medium border ${on ? "bg-accent border-accent text-white" : "border-gray-200 text-gray-600"}`}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="h-notes" className="block text-xs font-medium text-gray-500 mb-1.5">Notes for doctors</label>
          <textarea id="h-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything a doctor should know…"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <button type="button" onClick={() => void saveHealth()} disabled={saving}
          className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 inline-flex items-center gap-2">
          <Save className="w-4 h-4" aria-hidden /> Save health details
        </button>
      </section>
    </div>
  );
}
