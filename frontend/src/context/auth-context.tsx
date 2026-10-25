"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { get, post } from "@/lib/api";

export type Role = "user" | "doctor" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  doctorId?: string;
  language: string;
  avatarUrl?: string;
}

interface AuthEnvelope {
  success: boolean;
  data: { user?: AuthUser } & Partial<AuthUser>;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function extractUser(payload: AuthEnvelope | AuthUser): AuthUser {
  const u = ("data" in payload && payload.data ? (payload.data.user ?? (payload.data as AuthUser & { user?: AuthUser })) : payload) as AuthUser;
  return { ...u, role: (u.role ?? "user").toLowerCase() as Role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const payload = await get<AuthEnvelope | AuthUser>("/api/auth/me");
      setUser(extractUser(payload));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const payload = await post<AuthEnvelope | AuthUser>("/api/auth/login", { email, password });
    const u = extractUser(payload);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      const payload = await post<AuthEnvelope | AuthUser>("/api/auth/signup", {
        name,
        email,
        password,
        phone,
      });
      const u = extractUser(payload);
      await post("/api/auth/login", { email, password }).catch(() => undefined);
      setUser(u);
      return u;
    },
    []
  );

  const logout = useCallback(async () => {
    await post("/api/auth/logout").catch(() => undefined);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshUser }),
    [user, loading, login, signup, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function homeFor(user: AuthUser | null): string {
  if (!user) return "/login";
  if (user.role === "doctor") return "/doctor";
  if (user.role === "admin") return "/admin";
  return "/dashboard";
}
