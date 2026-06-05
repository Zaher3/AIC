import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery, getProjectPermission, canViewProject, canEditProject } from "./middleware";
import { getDb } from "./queries/connection";
import { projects, projectMembers } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const projectsRouter = createRouter({
  // List projects the user can see
  // Commercial: their own projects + shared projects
  // Directeur: all projects
  // Admin: all projects
  list: authedQuery
    .input(z.object({ companyId: z.number() }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const user = ctx.user;

      if (user.role === "admin" || user.role === "directeur") {
        // Admin/Directeur sees all projects for the company
        if (input?.companyId) {
          return db.select().from(projects).where(eq(projects.companyId, input.companyId));
        }
        return db.select().from(projects);
      }

      // Commercial: own projects + explicitly shared projects
      // First get all projects for the company
      let companyProjects: typeof projects.$inferSelect[] = [];
      if (input?.companyId) {
        companyProjects = await db
          .select()
          .from(projects)
          .where(eq(projects.companyId, input.companyId));
      } else {
        companyProjects = await db.select().from(projects);
      }

      // Filter to only those the user has access to
      const accessibleProjects = [];
      for (const project of companyProjects) {
        const hasAccess = await canViewProject(user.id, project.id, user.role);
        if (hasAccess) {
          accessibleProjects.push(project);
        }
      }

      return accessibleProjects;
    }),

  // Get single project - checks permissions
  get: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);

      if (project.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Check access
      const hasAccess = await canViewProject(ctx.user.id, input.id, ctx.user.role);
      if (!hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      // Include permission info
      const perm = await getProjectPermission(ctx.user.id, input.id, ctx.user.role);
      return { ...project[0], userPermission: perm };
    }),

  // Create project - any authenticated user becomes owner
  create: authedQuery
    .input(
      z.object({
        code: z.string().min(1), // e.g. "AIM-2024-001"
        name: z.string().min(1),
        companyId: z.number(),
        notes: z.string().optional(),
        status: z.enum(["active", "won", "lost", "archived"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Insert project
      const result = await db.insert(projects).values({
        code: input.code,
        name: input.name,
        companyId: input.companyId,
        ownerId: ctx.user.id,
        status: input.status ?? "active",
        notes: input.notes ?? "",
      });

      const projectId = Number(result[0].insertId);

      // Add owner as project member
      await db.insert(projectMembers).values({
        projectId,
        userId: ctx.user.id,
        permission: "owner",
      });

      return { id: projectId };
    }),

  // Update project - owner or editor
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        code: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "won", "lost", "archived"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const projectId = input.id;

      // Check edit permission
      const canEdit = await canEditProject(ctx.user.id, projectId, ctx.user.role);
      if (!canEdit && ctx.user.role !== "directeur") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Edit access denied" });
      }

      // Directeur can only edit if explicitly granted editor access
      if (ctx.user.role === "directeur") {
        const perm = await getProjectPermission(ctx.user.id, projectId, ctx.user.role);
        if (perm !== "editor") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Directeur needs owner authorization to edit",
          });
        }
      }

      const updates: Record<string, unknown> = {};
      if (input.code !== undefined) updates.code = input.code;
      if (input.name !== undefined) updates.name = input.name;
      if (input.notes !== undefined) updates.notes = input.notes;
      if (input.status !== undefined) updates.status = input.status;

      await db.update(projects).set(updates).where(eq(projects.id, projectId));
      return { success: true };
    }),

  // Delete project - owner or admin only
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const projectId = input.id;

      // Check ownership
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (project.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Only owner or admin can delete
      if (project[0].ownerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner or admin can delete" });
      }

      // Delete related records first (members, files)
      await db.delete(projectMembers).where(eq(projectMembers.projectId, projectId));
      // Note: files are kept in DB but disassociated; in production you'd cascade

      await db.delete(projects).where(eq(projects.id, projectId));
      return { success: true };
    }),

  // ====== SHARING / PERMISSIONS ======

  // Share project with a user (owner only)
  share: authedQuery
    .input(
      z.object({
        projectId: z.number(),
        userId: z.number(),
        permission: z.enum(["viewer", "editor"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const projectId = input.projectId;

      // Check ownership
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (project.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Only owner can share (or admin)
      if (project[0].ownerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can share" });
      }

      // Upsert membership
      const existing = await db
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, input.userId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(projectMembers)
          .set({
            permission: input.permission,
            grantedBy: ctx.user.id,
          })
          .where(eq(projectMembers.id, existing[0].id));
      } else {
        await db.insert(projectMembers).values({
          projectId,
          userId: input.userId,
          permission: input.permission,
          grantedBy: ctx.user.id,
        });
      }

      return { success: true };
    }),

  // Remove access (owner only)
  revokeAccess: authedQuery
    .input(z.object({ projectId: z.number(), userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Check ownership
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (project.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      if (project[0].ownerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can revoke" });
      }

      await db
        .delete(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, input.projectId),
            eq(projectMembers.userId, input.userId)
          )
        );

      return { success: true };
    }),

  // List project members with their permissions
  listMembers: authedQuery
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();

      // Check view access
      const hasAccess = await canViewProject(ctx.user.id, input.projectId, ctx.user.role);
      if (!hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      const members = await db
        .select()
        .from(projectMembers)
        .where(eq(projectMembers.projectId, input.projectId));

      return members;
    }),

  // Request edit access (directeur only)
  requestEdit: authedQuery
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "directeur") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only directeurs can request edit" });
      }

      const db = getDb();

      // Add as pending
      const existing = await db
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, input.projectId),
            eq(projectMembers.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(projectMembers)
          .set({ permission: "pending" })
          .where(eq(projectMembers.id, existing[0].id));
      } else {
        await db.insert(projectMembers).values({
          projectId: input.projectId,
          userId: ctx.user.id,
          permission: "pending",
        });
      }

      return { success: true, message: "Edit access requested, waiting for owner approval" };
    }),
});
