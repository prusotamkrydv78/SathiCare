"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Sparkles, Stethoscope, UserRound, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const LINKS = [
  { href: "/pregnancy-tracker", label: "Pregnancy tracker", desc: "Week-by-week journey", icon: Sparkles },
  { href: "/find-care", label: "Find care near you", desc: "Hospitals, reviews, distance", icon: Stethoscope },
  { href: "/forum", label: "Community", desc: "Share and support anonymously", icon: Users },
  { href: "/notifications", label: "Notifications", desc: "Appointments and replies", icon: Bell },
  { href: "/profile", label: "Profile & health details", desc: "Your private record", icon: UserRound },
];

export default function MorePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3.5">
        <span className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center text-lg font-bold">
          {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </span>
        <div className="min-w-0">
          <h1 className="text-lg font-bold truncate">{user.name}</h1>
          <p className="text-xs text-ink/45 truncate">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {LINKS.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-line bg-white p-4 active:scale-[0.98] transition-transform"
          >
            <span className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
              <Icon className="w-4 h-4" aria-hidden />
            </span>
            <p className="mt-2.5 text-sm font-semibold leading-tight">{label}</p>
            <p className="text-[11px] text-ink/40 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
        className="w-full flex items-center gap-3 rounded-2xl border border-rust/20 bg-rust-soft px-4 py-3.5 text-sm font-semibold text-rust active:scale-[0.99] transition-transform"
      >
        <LogOut className="w-4 h-4" aria-hidden />
        Log out
      </button>

      <p className="text-[11px] text-ink/40 text-center pt-2 leading-relaxed">
        SathiCare · care with compassion · Saathi AI powered by GPT
      </p>
    </div>
  );
}
