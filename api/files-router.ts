import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery, canViewProject, canEditProject } from "./middleware";
import { getDb } from "./queries/connection";
import { projectFiles } from "@db/schema";
import { eq } from "drizzle-orm";

export const filesRouter = createRouter({
  // List files for a project - checks view permission
  list: authedQuery
    .input(
      z.object({
        projectId: z.number(),
        stepId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();

      // Check project access
      const hasAccess = await canViewProject(ctx.user.id, input.projectId, ctx.user.role);
      if (!hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied to this project" });
      }

      let query = db
        .select()
        .from(projectFiles)
        .where(eq(projectFiles.projectId, input.projectId));

      return query;
    }),

  // Get single file
  get: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const file = await db
        .select()
        .from(projectFiles)
        .where(eq(projectFiles.id, input.id))
        .limit(1);

      if (file.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
      }

      // Check project access
      const hasAccess = await canViewProject(ctx.user.id, file[0].projectId, ctx.user.role);
      if (!hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return file[0];
    }),

  // Add file to project - requires edit permission
  create: authedQuery
    .input(
      z.object({
        projectId: z.number(),
        stepId: z.string(),
        name: z.string().min(1),
        fileType: z.enum(["pdf", "doc", "xls", "image", "other"]).default("other"),
        size: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Check edit permission
      const canEdit = await canEditProject(ctx.user.id, input.projectId, ctx.user.role);
      if (!canEdit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Edit permission required to add files",
        });
      }

      const result = await db.insert(projectFiles).values({
        projectId: input.projectId,
        stepId: input.stepId,
        name: input.name,
        fileType: input.fileType,
        size: input.size ?? "",
        date: new Date().toISOString().split("T")[0],
        createdBy: ctx.user.id,
      });

      return { id: Number(result[0].insertId) };
    }),

  // Delete file - requires edit permission
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Get file to check project
      const file = await db
        .select()
        .from(projectFiles)
        .where(eq(projectFiles.id, input.id))
        .limit(1);

      if (file.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
      }

      // Check edit permission on the project
      const canEdit = await canEditProject(ctx.user.id, file[0].projectId, ctx.user.role);
      if (!canEdit) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Edit permission required" });
      }

      await db.delete(projectFiles).where(eq(projectFiles.id, input.id));
      return { success: true };
    }),
});
