"use client";

import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#f43f8e] text-white p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Namaste, {user.name.split(" ")[0]} 👋</h1>
        <p className="mt-2 text-white/85 max-w-xl">
          Your health companion is being set up feature by feature. Trackers, Saathi AI,
          consultations and SOS are coming online on the new stack.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Period tracker", desc: "Cycle logging and predictions", soon: true },
          { title: "Pregnancy tracker", desc: "Week-by-week journey", soon: true },
          { title: "Saathi AI", desc: "Ask anything, danger-sign alerts", soon: true },
          { title: "Find care", desc: "Facilities and doctors near you", soon: true },
          { title: "Consultations", desc: "Book and chat with doctors", soon: true },
          { title: "SOS", desc: "One tap to alert your contacts", soon: true },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(45,55,72,0.05)]"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#FF6B9D] bg-[#FF6B9D]/10 rounded-full px-2 py-0.5">
                Soon
              </span>
            </div>
            <p className="mt-1.5 text-sm text-gray-500">{card.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        New stack online: Next.js frontend · .NET Web API · SQL Server — signed in as{" "}
        {user.email} ({user.role})
      </p>
    </div>
  );
}
