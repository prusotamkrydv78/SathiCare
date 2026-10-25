"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarHeart,
  HeartPulse,
  Home,
  Loader2,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/track", label: "Cycle", icon: CalendarHeart },
  { href: "/ai-chat", label: "Saathi", icon: Sparkles, center: true },
  { href: "/consultations", label: "Doctors", icon: Stethoscope },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

const MORE_LINKS = [
  { href: "/pregnancy-tracker", label: "Pregnancy tracker", icon: Sparkles },
  { href: "/find-care", label: "Find care near you", icon: Stethoscope },
  { href: "/forum", label: "Community", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile & health details", icon: UserRound },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.role !== "user") router.replace("/dashboard");
  }, [loading, user, router]);

  useEffect(() => setMoreOpen(false), [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  if (loading || !user || user.role !== "user") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" aria-hidden />
        <p className="text-sm text-gray-500">Loading your space…</p>
      </div>
    );
  }

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <div className="min-h-screen bg-paper">
      {/* Mobile app frame — centered phone column on desktop */}
      <div className="mx-auto w-full max-w-md min-h-screen bg-white sm:my-4 sm:rounded-[2rem] sm:shadow-2xl sm:shadow-gray-300/40 sm:min-h-[calc(100vh-2rem)] flex flex-col relative overflow-hidden">
        {/* App bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="flex items-center justify-between px-4 h-14">
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4" aria-hidden />
              </span>
              <span className="font-semibold text-gray-900 text-sm truncate">SathiCare</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative"
              >
                <Bell className="w-5 h-5" aria-hidden />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" aria-hidden />
              </Link>
              <Link
                href="/profile"
                aria-label="Your profile"
                className="w-8 h-8 rounded-full bg-accent-soft text-accent flex items-center justify-center text-[11px] font-bold"
              >
                {initials}
              </Link>
            </div>
          </div>
        </header>

        {/* Screen */}
        <main className="flex-1 px-4 py-5 pb-28">{children}</main>

        {/* More sheet */}
        {moreOpen && (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="More menu">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setMoreOpen(false)}
            />
            <div className="absolute bottom-0 inset-x-0 mx-auto max-w-md bg-white rounded-t-3xl p-5 pb-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setMoreOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" aria-hidden />
                </button>
              </div>
              <nav aria-label="More sections" className="space-y-1">
                {MORE_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium ${
                      pathname === href ? "bg-accent-soft text-accent" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden />
                    </span>
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <span className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4" aria-hidden />
                  </span>
                  Log out
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Bottom tab bar — mobile app navigation */}
        <nav
          aria-label="Main"
          className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-md bg-white/95 backdrop-blur border-t border-gray-100 pb-[env(safe-area-inset-bottom)]"
        >
          <ul className="flex items-stretch justify-around px-1">
            {TABS.map(({ href, label, icon: Icon, center }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              if (center) {
                return (
                  <li key={href} className="relative -mt-5">
                    <Link
                      href={href}
                      aria-label="Saathi AI"
                      aria-current={active ? "page" : undefined}
                      className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-accent text-white shadow-lg shadow-accent/40 active:scale-95 transition-transform"
                    >
                      <Icon className="w-6 h-6" aria-hidden />
                    </Link>
                    <span className="block text-center text-[10px] font-semibold text-gray-600 mt-0.5">{label}</span>
                  </li>
                );
              }
              return (
                <li key={href} className="flex-1">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium ${
                      active ? "text-accent" : "text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
