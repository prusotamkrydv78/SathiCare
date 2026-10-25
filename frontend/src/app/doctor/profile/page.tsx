"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Star, Stethoscope } from "lucide-react";
import { get } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface DoctorProfile {
  id: string; name: string; email: string; specialization: string; qualifications?: string | null;
  experienceYears: number; consultationFee: number; languages: string[]; about?: string | null;
  rating: number; totalRatings: number; totalConsultations: number;
  availability: { day: string; slots: string[] }[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      if (!user?.doctorId) { setLoading(false); return; }
      try {
        const res = await get<{ data: DoctorProfile }>(`/api/doctors/${user.doctorId}`);
        setDoctor(res.data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-teal-500 animate-spin" aria-hidden /></div>;
  }

  if (!doctor) {
    return <p className="text-sm text-gray-500">Could not load your doctor profile.</p>;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <span className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center font-bold text-xl">
            {doctor.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{doctor.name}</h1>
            <p className="text-white/80 text-sm mt-0.5">{doctor.specialization} · {doctor.experienceYears} years experience</p>
            <p className="text-white/70 text-xs mt-1 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden />
              {doctor.rating.toFixed(1)} ({doctor.totalRatings} ratings · {doctor.totalConsultations} consultations)
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold">NPR {doctor.consultationFee}</p>
            <p className="text-white/70 text-xs">per consultation</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" aria-hidden /> About
          </h2>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{doctor.about}</p>
          <div className="mt-4 space-y-1.5 text-sm text-gray-600">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" aria-hidden /> {doctor.email}</p>
            <p className="text-gray-500 text-xs">{doctor.qualifications}</p>
            <p className="text-gray-500 text-xs">Speaks: {doctor.languages.join(", ")}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Weekly availability</h2>
          <ul className="mt-3 space-y-2">
            {DAYS.map((day) => {
              const entry = doctor.availability.find((a) => a.day === day);
              return (
                <li key={day} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{day}</span>
                  <span className={entry?.slots.length ? "text-gray-800 font-medium text-xs" : "text-gray-300 text-xs"}>
                    {entry?.slots.length ? entry.slots.join(" · ") : "Off"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-gray-400 mt-4">Availability is managed by the admin team in this demo.</p>
        </section>
      </div>
    </div>
  );
}
