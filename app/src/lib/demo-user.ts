/**
 * Mode Demo - Contourne l'authentification Kimi OAuth
 * Stocke un utilisateur fictif dans le localStorage
 */

import type { User } from "@db/schema";

const DEMO_USER_KEY = "carto_demo_user";

export interface DemoUser {
  id: number;
  unionId: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: "commercial" | "directeur" | "admin";
  createdAt: string;
  updatedAt: string;
  lastSignInAt: string;
}

export const DEMO_USERS: Record<string, DemoUser> = {
  directeur: {
    id: 1,
    unionId: "demo_directeur_001",
    name: "Karim Benali",
    email: "k.benali@entreprise.ma",
    avatar: null,
    role: "directeur",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
  },
  resp1: {
    id: 2,
    unionId: "demo_resp1_002",
    name: "Sara El Amrani",
    email: "s.elamrani@entreprise.ma",
    avatar: null,
    role: "directeur",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
  },
  resp2: {
    id: 3,
    unionId: "demo_resp2_003",
    name: "Youssef Idrissi",
    email: "y.idrissi@entreprise.ma",
    avatar: null,
    role: "directeur",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
  },
  com1: {
    id: 4,
    unionId: "demo_com1_004",
    name: "Fatima Zahra",
    email: "f.zahra@entreprise.ma",
    avatar: null,
    role: "commercial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
  },
  com2: {
    id: 5,
    unionId: "demo_com2_005",
    name: "Omar Farouk",
    email: "o.farouk@entreprise.ma",
    avatar: null,
    role: "commercial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
  },
  com3: {
    id: 6,
    unionId: "demo_com3_006",
    name: "Laila Bennani",
    email: "l.bennani@entreprise.ma",
    avatar: null,
    role: "commercial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
  },
  com4: {
    id: 7,
    unionId: "demo_com4_007",
    name: "Hassan Moussaoui",
    email: "h.moussaoui@entreprise.ma",
    avatar: null,
    role: "commercial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
  },
};

export function getDemoUser(): DemoUser | null {
  try {
    const stored = localStorage.getItem(DEMO_USER_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as DemoUser;
  } catch {
    return null;
  }
}

export function setDemoUser(userKey: string): DemoUser | null {
  const user = DEMO_USERS[userKey];
  if (!user) return null;
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  return user;
}

export function clearDemoUser(): void {
  localStorage.removeItem(DEMO_USER_KEY);
}

export function isDemoMode(): boolean {
  return !!getDemoUser();
}

/**
 * Convertit un DemoUser au format User (compatible avec le type Drizzle)
 */
export function toUserFormat(demoUser: DemoUser): User {
  return {
    ...demoUser,
    createdAt: new Date(demoUser.createdAt),
    updatedAt: new Date(demoUser.updatedAt),
    lastSignInAt: new Date(demoUser.lastSignInAt),
  } as User;
}
