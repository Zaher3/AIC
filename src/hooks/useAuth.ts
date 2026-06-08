import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { authApi, getToken } from "@/lib/api";
import { initDemoData } from "@/lib/demo-data";
import type { AuthResponse } from "@/lib/api";

const DEMO_USERS: Record<string, AuthResponse["user"]> = {
  "directeur@demo.com": { id: 1, name: "Karim Benali", email: "directeur@demo.com", role: "directeur", teamId: null, createdAt: "", updatedAt: "" },
  "resp1@demo.com": { id: 2, name: "Sara El Amrani", email: "resp1@demo.com", role: "directeur", teamId: 1, createdAt: "", updatedAt: "" },
  "resp2@demo.com": { id: 3, name: "Youssef Idrissi", email: "resp2@demo.com", role: "directeur", teamId: 2, createdAt: "", updatedAt: "" },
  "com1@demo.com": { id: 4, name: "Fatima Zahra", email: "com1@demo.com", role: "commercial", teamId: 1, createdAt: "", updatedAt: "" },
  "com2@demo.com": { id: 5, name: "Omar Farouk", email: "com2@demo.com", role: "commercial", teamId: 1, createdAt: "", updatedAt: "" },
  "com3@demo.com": { id: 6, name: "Laila Bennani", email: "com3@demo.com", role: "commercial", teamId: 2, createdAt: "", updatedAt: "" },
  "com4@demo.com": { id: 7, name: "Hassan Moussaoui", email: "com4@demo.com", role: "commercial", teamId: 2, createdAt: "", updatedAt: "" },
};

function isDemoToken(token: string): boolean { return token.startsWith("demo_"); }

function parseDemoToken(token: string): AuthResponse["user"] | null {
  try { const decoded = JSON.parse(atob(token.replace("demo_", ""))); return DEMO_USERS[decoded.email] || null; }
  catch { return null; }
}

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } = options ?? {};
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token && isDemoToken(token)) {
        const demoUser = parseDemoToken(token);
        if (demoUser) { setUser(demoUser); initDemoData(); setIsLoading(false); return; }
        localStorage.removeItem("auth_token");
      }
      if (!token) { setIsLoading(false); return; }
      try {
        const result = await authApi.me();
        if (result.user) { setUser(result.user); }
        else { localStorage.removeItem("auth_token"); }
      } catch {
        localStorage.removeItem("auth_token");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user && window.location.pathname !== redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authApi.login({ email, password });
      localStorage.setItem("auth_token", result.token);
      setUser(result.user);
      return { success: true as const, user: result.user };
    } catch (err: any) {
      return { success: false as const, error: err.message || "Login failed" };
    } finally { setIsLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate(redirectPath);
    window.location.reload();
  }, [navigate, redirectPath]);

  return useMemo(() => ({
    user, isAuthenticated: !!user, isLoading, isDemo: !!user && isDemoToken(getToken() || ""),
    login, logout,
  }), [user, isLoading, login, logout]);
}
