"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarPlus, Check, Loader2, MessageSquare, Search, Star, X } from "lucide-react";
import { get, post } from "@/lib/api";

interface Doctor {
  id: string; name: string; specialization: string; qualifications?: string | null;
  experienceYears: number; consultationFee: number; languages: string[];
  about?: string | null; rating: number; totalRatings: number; totalConsultations: number;
  availability: { day: string; slots: string[] }[];
}
interface Appointment {
  id: string; doctorId: string; doctorName?: string | null; specialization?: string | null;
  date: string; time: string; status: string; reason: string;
  notes?: string | null; prescription?: string | null; rejectionReason?: string | null;
}

const SPECIALIZATIONS = ["All", "Gynecologist", "Obstetrician", "General Physician", "Pediatrician", "Psychiatrist", "Nutritionist"];

export default function ConsultationsPage() {
  const [tab, setTab] = useState<"doctors" | "appointments">("doctors");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");

  // booking modal state
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [slots, setSlots] = useState<{ available: string[]; booked: string[] } | null>(null);
  const [slot, setSlot] = useState("");
  const [reason, setReason] = useState("");
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (specialization !== "All") params.set("specialization", specialization);
    const res = await get<{ data: { doctors: Doctor[] } }>(`/api/doctors?${params}`);
    setDoctors(res.data.doctors);
  }, [search, specialization]);

  const loadAppointments = useCallback(async () => {
    const res = await get<{ data: { appointments: Appointment[] } }>("/api/appointments/mine");
    setAppointments(res.data.appointments);
  }, []);

  useEffect(() => {
    void (async () => {
      await Promise.allSettled([loadDoctors(), loadAppointments()]);
      setLoading(false);
    })();
  }, [loadDoctors, loadAppointments]);

  const openBooking = async (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setBookingDate("");
    setSlots(null);
    setSlot("");
    setReason("");
    setBookingMsg(null);
    setBookingError(null);
  };

  const pickDate = async (date: string) => {
    setBookingDate(date);
    setSlot("");
    setSlots(null);
    if (!bookingDoctor || !date) return;
    try {
      const res = await get<{ data: { available: string[]; booked: string[] } }>(
        `/api/doctors/${bookingDoctor.id}/availability?date=${date}`
      );
      setSlots(res.data);
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : "Could not load availability");
    }
  };

  const book = async () => {
    if (!bookingDoctor || !bookingDate || !slot || !reason.trim()) return;
    setBookingBusy(true);
    setBookingError(null);
    try {
      await post("/api/appointments/book", {
        doctorId: bookingDoctor.id,
        date: bookingDate,
        time: slot,
        reason: reason.trim(),
      });
      setBookingMsg("Request sent — the doctor will confirm shortly. You will get a notification.");
      await loadAppointments();
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setBookingBusy(false);
    }
  };

  const doCancel = async (id: string) => {
    const { put } = await import("@/lib/api");
    await put(`/api/appointments/${id}/cancel`).catch(() => undefined);
    await loadAppointments();
  };

  const upcoming = appointments.filter((a) => a.status === "accepted" || a.status === "pending");
  const past = appointments.filter((a) => !upcoming.includes(a));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Consultations</h1>
          <p className="text-sm text-gray-500 mt-1">Find a doctor, book a time, and chat privately.</p>
        </div>
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 text-sm">
          {(["doctors", "appointments"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`px-4 py-1.5 rounded-lg font-medium capitalize ${tab === t ? "bg-accent text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {t === "doctors" ? "Find doctors" : "My appointments"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-7 h-7 text-accent animate-spin" aria-hidden />
        </div>
      ) : tab === "doctors" ? (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialty…"
                aria-label="Search doctors"
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SPECIALIZATIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecialization(s)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border ${
                    specialization === s ? "bg-accent border-accent text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((d) => (
              <article key={d.id} className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center font-bold">
                    {d.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">{d.name}</h2>
                    <p className="text-sm text-accent">{d.specialization}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.experienceYears} yrs · {d.languages.join(", ")}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden />
                    {d.rating.toFixed(1)}
                  </span>
                </div>
                {d.about && <p className="text-xs text-gray-500 mt-3 line-clamp-2">{d.about}</p>}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">NPR {d.consultationFee}</span>
                  <button
                    type="button"
                    onClick={() => void openBooking(d)}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
                  >
                    <CalendarPlus className="w-4 h-4" aria-hidden /> Book
                  </button>
                </div>
              </article>
            ))}
            {doctors.length === 0 && (
              <p className="text-sm text-gray-500 col-span-2 text-center py-10">No doctors match your search.</p>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {[
            { title: "Upcoming", list: upcoming },
            { title: "Past", list: past },
          ].map(({ title, list }) => (
            <section key={title}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h2>
              {list.length ? (
                <ul className="mt-3 space-y-3">
                  {list.map((a) => (
                    <li key={a.id} className="rounded-2xl border border-gray-100 bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{a.doctorName}</p>
                          <p className="text-xs text-gray-400">{a.specialization}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })} · {a.time}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Reason: {a.reason}</p>
                          {a.status === "rejected" && a.rejectionReason && (
                            <p className="text-xs text-red-600 mt-1">Declined: {a.rejectionReason}</p>
                          )}
                          {(a.notes || a.prescription) && (
                            <div className="mt-2 rounded-xl bg-gray-50 px-3.5 py-2.5 text-xs text-gray-600 space-y-1">
                              {a.notes && <p><span className="font-semibold">Notes:</span> {a.notes}</p>}
                              {a.prescription && <p><span className="font-semibold">Rx:</span> {a.prescription}</p>}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-stretch">
                          <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 text-center ${
                            a.status === "accepted" ? "bg-emerald-50 text-emerald-700"
                            : a.status === "pending" ? "bg-amber-50 text-amber-700"
                            : a.status === "rejected" ? "bg-red-50 text-red-600"
                            : a.status === "completed" ? "bg-indigo-50 text-indigo-700"
                            : "bg-gray-100 text-gray-500"
                          }`}>
                            {a.status}
                          </span>
                          {a.status === "accepted" && (
                            <Link
                              href={`/consultations/${a.id}/chat`}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-strong"
                            >
                              <MessageSquare className="w-3.5 h-3.5" aria-hidden /> Chat
                            </Link>
                          )}
                          {(a.status === "pending" || a.status === "accepted") && (
                            <button
                              type="button"
                              onClick={() => void doCancel(a.id)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                            >
                              <X className="w-3.5 h-3.5" aria-hidden /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 mt-2">Nothing here yet.</p>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Booking modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Book appointment">
          <button type="button" aria-label="Close booking" className="absolute inset-0 bg-gray-900/40" onClick={() => setBookingDoctor(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            {bookingMsg ? (
              <div className="text-center py-6">
                <span className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" aria-hidden />
                </span>
                <h2 className="mt-4 font-bold text-gray-900">Request sent</h2>
                <p className="text-sm text-gray-500 mt-2">{bookingMsg}</p>
                <button
                  type="button"
                  onClick={() => { setBookingDoctor(null); setTab("appointments"); }}
                  className="mt-5 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong"
                >
                  View my appointments
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">{bookingDoctor.name}</h2>
                    <p className="text-sm text-accent">{bookingDoctor.specialization} · NPR {bookingDoctor.consultationFee}</p>
                  </div>
                  <button type="button" onClick={() => setBookingDoctor(null)} aria-label="Close" className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                    <X className="w-4 h-4" aria-hidden />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="booking-date" className="block text-xs font-medium text-gray-500 mb-1.5">Date</label>
                    <input
                      id="booking-date"
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => void pickDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {slots && (
                    <div>
                      <span className="block text-xs font-medium text-gray-500 mb-1.5">Available times</span>
                      {slots.available.length ? (
                        <div className="grid grid-cols-3 gap-2">
                          {slots.available.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSlot(s)}
                              className={`rounded-xl border px-2 py-2 text-xs font-medium ${
                                slot === s ? "bg-accent border-accent text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No free slots that day — try another date.</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label htmlFor="booking-reason" className="block text-xs font-medium text-gray-500 mb-1.5">Reason for visit</label>
                    <textarea
                      id="booking-reason"
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe your symptoms or question…"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {bookingError && <p role="alert" className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{bookingError}</p>}

                  <button
                    type="button"
                    onClick={() => void book()}
                    disabled={!bookingDate || !slot || !reason.trim() || bookingBusy}
                    className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {bookingBusy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                    Send request
                  </button>
                  <p className="text-[11px] text-gray-400 text-center">The doctor confirms — no auto approval, no fake countdown.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
