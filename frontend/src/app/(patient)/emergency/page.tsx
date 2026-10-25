"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, MapPin, Phone, Plus, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { del, get, post } from "@/lib/api";

interface Contact { id: string; name: string; phone: string; relation: string }
interface SosResult {
  alertId: string;
  contactsNotified: { Name: string; phone: string; smsSent: boolean }[];
  smsLog: string;
  hotlines: { label: string; phone: string }[];
}

export default function SosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("Family");
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sosBusy, setSosBusy] = useState(false);
  const [sosResult, setSosResult] = useState<SosResult | null>(null);
  const [sosError, setSosError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await get<{ data: { contacts: Contact[] } }>("/api/emergency/contacts");
      setContacts(res.data.contacts);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const addContact = async () => {
    setFormError(null);
    setAdding(true);
    try {
      const res = await post<{ data: { contacts: Contact[] } }>("/api/emergency/contacts", {
        name, phone, relation,
      });
      setContacts(res.data.contacts);
      setShowForm(false);
      setName(""); setPhone("");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not add contact");
    } finally {
      setAdding(false);
    }
  };

  const removeContact = async (id: string) => {
    await del(`/api/emergency/contacts/${id}`).catch(() => undefined);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const triggerSos = async () => {
    setConfirmOpen(false);
    setSosBusy(true);
    setSosError(null);
    setSosResult(null);

    const location = await new Promise<{ lat: number | null; lon: number | null; label: string | null }>((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: null, lon: null, label: null });
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, label: `Lat ${p.coords.latitude.toFixed(4)}, Lon ${p.coords.longitude.toFixed(4)}` }),
        () => resolve({ lat: null, lon: null, label: "Demo location — Janakpur" }),
        { timeout: 4000 }
      );
    });

    try {
      const res = await post<{ data: SosResult }>("/api/emergency/sos", {
        latitude: location.lat,
        longitude: location.lon,
        locationLabel: location.label,
        message: null,
      });
      setSosResult(res.data);
    } catch (e) {
      setSosError(e instanceof Error ? e.message : "Could not trigger SOS");
    } finally {
      setSosBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SOS Emergency</h1>
        <p className="text-sm text-gray-500 mt-1">One tap alerts your emergency contacts with your location.</p>
      </div>

      {/* SOS button */}
      <section className="rounded-2xl border border-red-100 bg-white p-8 text-center relative">
        {confirmOpen && (
          <div className="absolute inset-0 z-10 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label="Confirm SOS">
            <div className="max-w-xs">
              <h2 className="text-lg font-bold text-gray-900">Send SOS now?</h2>
              <p className="mt-2 text-sm text-gray-500">
                We will alert {contacts.length} contact{contacts.length === 1 ? "" : "s"} with your location. Use this only in a real emergency.
              </p>
              <div className="mt-5 flex gap-2 justify-center">
                <button type="button" onClick={() => setConfirmOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="button" onClick={() => void triggerSos()}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
                  Yes, send SOS
                </button>
              </div>
            </div>
          </div>
        )}
        {sosResult ? (
          <div className="py-2">
            <span className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-bold text-gray-900">Your contacts were alerted</h2>
            <ul className="mt-3 space-y-1.5">
              {sosResult.contactsNotified.map((c) => (
                <li key={c.phone} className="text-sm text-gray-600">
                  {c.Name} · {c.phone} <span className="text-emerald-600 font-medium">notified ✓</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-3">{sosResult.smsLog}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {sosResult.hotlines.map((h) => (
                <a key={h.phone} href={`tel:${h.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700">
                  <Phone className="w-4 h-4" aria-hidden /> Call {h.label} ({h.phone})
                </a>
              ))}
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => contacts.length > 0 && setConfirmOpen(true)}
              disabled={sosBusy || contacts.length === 0}
              aria-label="Trigger SOS alert"
              className={`w-36 h-36 rounded-full text-white text-lg font-bold shadow-lg transition-transform ${
                contacts.length === 0
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95"
              }`}>
              {sosBusy ? <Loader2 className="w-8 h-8 animate-spin mx-auto" aria-hidden /> : "SOS"}
            </button>
            <p className="mt-4 text-sm text-gray-500">
              {contacts.length === 0
                ? "Add at least one emergency contact below to enable SOS."
                : `Alerts ${contacts.length} contact${contacts.length === 1 ? "" : "s"} with your location`}
            </p>
            {sosError && (
              <p role="alert" className="mt-3 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{sosError}</p>
            )}
          </>
        )}
      </section>

      {/* Hotlines */}
      <section className="grid grid-cols-2 gap-3">
        {[
          { label: "Ambulance", phone: "102" },
          { label: "Health helpline", phone: "1115" },
          { label: "Police", phone: "100" },
          { label: "Women's helpline", phone: "1145" },
        ].map((h) => (
          <a key={h.phone} href={`tel:${h.phone}`}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 hover:border-red-200 group">
            <div>
              <p className="text-sm font-semibold text-gray-900">{h.label}</p>
              <p className="text-xs text-gray-400">{h.phone}</p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100">
              <Phone className="w-4 h-4" aria-hidden />
            </span>
          </a>
        ))}
      </section>

      {/* Contacts */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" aria-hidden /> Emergency contacts
          </h2>
          {contacts.length < 5 && (
            <button
              type="button"
              onClick={() => setShowForm((s) => !s)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e0447d] hover:underline">
              <UserPlus className="w-4 h-4" aria-hidden /> Add
            </button>
          )}
        </div>

        {showForm && (
          <form
            className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2.5"
            onSubmit={(e) => { e.preventDefault(); void addContact(); }}
          >
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required aria-label="Contact name"
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 98XXXXXXXX" required aria-label="Phone number"
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]" />
            <select value={relation} onChange={(e) => setRelation(e.target.value)} aria-label="Relation"
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]">
              {["Family", "Friend", "Husband", "Mother", "Father", "Sister", "Neighbor", "Doctor"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button type="submit" disabled={adding}
              className="rounded-xl bg-[#FF6B9D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#f43f8e] disabled:opacity-60 inline-flex items-center gap-1.5">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Plus className="w-4 h-4" aria-hidden />} Save
            </button>
            {formError && <p role="alert" className="sm:col-span-4 text-xs text-red-600">{formError}</p>}
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 text-gray-300 animate-spin" aria-hidden />
          </div>
        ) : contacts.length ? (
          <ul className="mt-4 divide-y divide-gray-100">
            {contacts.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-[#FFE9F0] text-[#c2446f] flex items-center justify-center text-xs font-bold shrink-0">
                    {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.relation} · {c.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={`tel:${c.phone}`} aria-label={`Call ${c.name}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50">
                    <Phone className="w-4 h-4" aria-hidden />
                  </a>
                  <button type="button" onClick={() => void removeContact(c.id)} aria-label={`Remove ${c.name}`}
                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No contacts yet. Add the people we should alert.</p>
        )}
      </section>

      <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
        <MapPin className="w-3 h-3" aria-hidden /> Demo mode: location is approximate and SMS messages are logged, not sent.
      </p>
      </div>
  );
}
