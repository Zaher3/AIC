import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { getDb } from "./queries/connection";
import { projectMembers, projects } from "@db/schema";
import { eq, and } from "drizzle-orm";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

// ====== AUTH MIDDLEWARE ======

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

function requireRole(...roles: string[]) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || !roles.includes(ctx.user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

// ====== ROLE-BASED PROCEDURES ======

export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("admin"));
export const directeurQuery = authedQuery.use(requireRole("admin", "directeur"));

// ====== PROJECT PERMISSION HELPERS ======

/**
 * Check if a user can access a project based on their role and project membership.
 * Returns permission level or null if no access.
 */
export async function getProjectPermission(
  userId: number,
  projectId: number,
  userRole: string
): Promise<string | null> {
  const db = getDb();

  // Admin can do everything
  if (userRole === "admin") return "owner";

  // Directeur can view everything, edit needs explicit authorization
  if (userRole === "directeur") {
    const member = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.userId, userId)
        )
      )
      .limit(1);

    if (member.length > 0 && member[0].permission === "editor") {
      return "editor";
    }
    return "viewer"; // Directeur can always view
  }

  // Commercial - check project ownership and memberships
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (project.length === 0) return null;

  // Owner has full control
  if (project[0].ownerId === userId) return "owner";

  // Check explicit membership
  const member = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      )
    )
    .limit(1);

  if (member.length > 0) {
    const perm = member[0].permission;
    if (perm === "pending") return null;
    return perm;
  }

  return null;
}

/**
 * Check if user can edit a project
 */
export async function canEditProject(
  userId: number,
  projectId: number,
  userRole: string
): Promise<boolean> {
  const perm = await getProjectPermission(userId, projectId, userRole);
  return perm === "owner" || perm === "editor";
}

/**
 * Check if user can view a project
 */
export async function canViewProject(
  userId: number,
  projectId: number,
  userRole: string
): Promise<boolean> {
  const perm = await getProjectPermission(userId, projectId, userRole);
  return perm !== null;
}
