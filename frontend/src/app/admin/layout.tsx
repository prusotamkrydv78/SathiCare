"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, CalendarHeart, Flag, LayoutDashboard, Loader2, LogOut, Menu, Settings, ShieldCheck, Siren, Stethoscope, Users, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/sos", label: "SOS alerts", icon: Siren },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.role !== "admin") router.replace("/dashboard");
  }, [loading, user, router]);

  useEffect(() => setDrawerOpen(false), [pathname]);
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" aria-hidden />
        <p className="text-sm text-gray-500">Loading admin console…</p>
      </div>
    );
  }

  const nav = (
    <>
      <Link href="/admin" className="flex items-center gap-2.5 px-1 mb-5">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 text-white flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block font-semibold text-gray-900">SathiCare</span>
          <span className="block text-xs text-gray-400">Admin console</span>
        </span>
      </Link>
      <nav aria-label="Admin console" className="space-y-1">
        {NAV.map(({ href, label, icon: Icon, end }) => {
          const active = end ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                active ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-100"
              }`}>
              <Icon className="w-4 h-4 shrink-0" aria-hidden /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <div className="rounded-2xl bg-violet-50/60 p-3 mb-3 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <button type="button" onClick={() => void logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600">
          <LogOut className="w-4 h-4" aria-hidden /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-gray-100 bg-white p-4 sticky top-0 h-screen">{nav}</aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-gray-900/30" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white p-4 flex flex-col shadow-xl">
            <button type="button" aria-label="Close menu" className="absolute top-3 right-3 p-2 text-gray-400" onClick={() => setDrawerOpen(false)}>
              <X className="w-5 h-5" aria-hidden />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="flex items-center justify-between px-4 sm:px-8 h-14">
            <div className="flex items-center gap-3 min-w-0">
              <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation"
                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100">
                <Menu className="w-5 h-5" aria-hidden />
              </button>
              <h1 className="text-sm sm:text-base font-semibold text-gray-900">Admin console</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wide text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">Demo</span>
              <button type="button" onClick={() => void logout()} aria-label="Log out"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600">
                <LogOut className="w-5 h-5" aria-hidden />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-8 py-6 lg:py-10 w-full max-w-5xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
