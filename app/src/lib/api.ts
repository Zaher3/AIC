/**
 * REST API Client
 * Communicates with the Express backend at /api/*
 * Current Status: Frontend login page being built
 */

const API_BASE = "/api";

// Get stored JWT token
function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

// Build headers with auth token
function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Generic API request helper
async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const options: RequestInit = {
    method,
    headers: buildHeaders(),
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || data.error || "Request failed");
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }

  return data as T;
}

// ==================== AUTH API ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "commercial" | "directeur" | "admin";
  teamId?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    name: string | null;
    email: string | null;
    role: string;
    teamId: number | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MeResponse {
  success: boolean;
  user: AuthResponse["user"] | null;
}

export const authApi = {
  // Login with email/password
  login: (credentials: LoginCredentials) =>
    apiRequest<AuthResponse>("POST", "/auth/login", credentials),

  // Register new account
  register: (data: RegisterData) =>
    apiRequest<AuthResponse>("POST", "/auth/register", data),

  // Logout (client-side token removal)
  logout: () => {
    localStorage.removeItem("auth_token");
    return Promise.resolve();
  },

  // Get current user
  me: () => apiRequest<MeResponse>("GET", "/auth/me"),

  // Get user's team
  getTeam: () => apiRequest<{ success: boolean; team: any }>("GET", "/auth/team"),
};

// ==================== TEAMS API ====================

export interface Team {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  members?: AuthResponse["user"][];
}

export const teamsApi = {
  list: () => apiRequest<{ success: boolean; teams: Team[] }>("GET", "/teams"),
  get: (id: number) => apiRequest<{ success: boolean; team: Team }>("GET", `/teams/${id}`),
  create: (data: { name: string; description?: string }) =>
    apiRequest<{ success: boolean; team: Team }>("POST", "/teams", data),
  update: (id: number, data: { name?: string; description?: string }) =>
    apiRequest<{ success: boolean; team: Team }>("PUT", `/teams/${id}`, data),
  delete: (id: number) =>
    apiRequest<{ success: boolean; message: string }>("DELETE", `/teams/${id}`),
};

// ==================== USERS API ====================

export const usersApi = {
  list: () => apiRequest<{ success: boolean; users: AuthResponse["user"][] }>("GET", "/users"),
  get: (id: number) => apiRequest<{ success: boolean; user: AuthResponse["user"] }>("GET", `/users/${id}`),
  update: (id: number, data: { role?: string; teamId?: number | null }) =>
    apiRequest<{ success: boolean; user: AuthResponse["user"] }>("PUT", `/users/${id}`, data),
};

// ==================== HEALTH CHECK ====================

export const healthApi = {
  check: () => apiRequest<{ status: string; env: string }>("GET", "/health"),
};

export { getToken, buildHeaders };
