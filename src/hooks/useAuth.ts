import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { authApi, getToken } from "@/lib/api";
import type { AuthResponse } from "@/lib/api";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

/**
 * Auth Hook — uses REST API (not tRPC)
 * Current Status: Frontend login page being built
 */
export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } =
    options ?? {};

  const navigate = useNavigate();

  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const result = await authApi.me();
        if (result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid — clear it
          localStorage.removeItem("auth_token");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("[auth] Session check failed:", err);
        localStorage.removeItem("auth_token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath]);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const result = await authApi.login({ email, password });
        localStorage.setItem("auth_token", result.token);
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true as const, user: result.user };
      } catch (err: any) {
        console.error("[auth] Login failed:", err);
        return {
          success: false as const,
          error: err.message || "Login failed",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Register function
  const register = useCallback(
    async (data: { name: string; email: string; password: string; role?: string; teamId?: number }) => {
      setIsLoading(true);
      try {
        const result = await authApi.register(data as any);
        localStorage.setItem("auth_token", result.token);
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true as const, user: result.user };
      } catch (err: any) {
        console.error("[auth] Registration failed:", err);
        return {
          success: false as const,
          error: err.message || "Registration failed",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate(redirectPath);
  }, [navigate, redirectPath]);

  // Refresh user data
  const refresh = useCallback(async () => {
    try {
      const result = await authApi.me();
      if (result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("[auth] Refresh failed:", err);
    }
  }, []);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, isAuthenticated, isLoading, login, register, logout, refresh]
  );
}
