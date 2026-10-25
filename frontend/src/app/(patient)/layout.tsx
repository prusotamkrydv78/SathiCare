"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarHeart,
  HeartPulse,
  Loader2,
  LogOut,
  Menu,
  MessageCircleHeart,
  MessageSquare,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { useAuth, homeFor } from "@/context/auth-context";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: HeartPulse },
  { href: "/track", label: "Period Tracker", icon: CalendarHeart },
  { href: "/pregnancy-tracker", label: "Pregnancy", icon: Sparkles },
  { href: "/ai-chat", label: "Saathi AI", icon: MessageCircleHeart },
  { href: "/find-care", label: "Find Care", icon: Stethoscope },
  { href: "/consultations", label: "Consultations", icon: MessageSquare },
  { href: "/emergency", label: "SOS", icon: ShieldPlus },
  { href: "/forum", label: "Community", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.role !== "user") router.replace(homeFor(user));
  }, [loading, user, router]);

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (loading || !user || user.role !== "user") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-[#FF6B9D] animate-spin" aria-hidden />
        <p className="text-sm text-gray-500">Loading your space…</p>
      </div>
    );
  }

  const nav = (
    <>
      <Link href="/dashboard" className="flex items-center gap-2.5 px-1 mb-5">
        <span className="w-9 h-9 rounded-xl bg-[#FF6B9D] text-white flex items-center justify-center">
          <HeartPulse className="w-5 h-5" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block font-semibold text-gray-900">SathiCare</span>
          <span className="block text-xs text-gray-400">Your health companion</span>
        </span>
      </Link>
      <nav aria-label="Main" className="space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B9D] ${
                active
                  ? "bg-[#FF6B9D]/10 text-[#e0447d]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <div className="rounded-2xl bg-[#FFE9F0] p-3 mb-3 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B9D]"
        >
          <LogOut className="w-4 h-4" aria-hidden />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-gray-100 bg-white p-4 sticky top-0 h-screen">
        {nav}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-gray-900/30"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white p-4 flex flex-col shadow-xl">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-700"
              onClick={() => setDrawerOpen(false)}
            >
              <X className="w-5 h-5" aria-hidden />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" aria-hidden />
            </button>
            <span className="font-semibold text-gray-900">SathiCare</span>
            <span className="w-8 h-8 rounded-full bg-[#FF6B9D]/15 text-[#e0447d] flex items-center justify-center text-xs font-bold">
              {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 w-full max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
