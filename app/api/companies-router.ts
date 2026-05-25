import { z } from "zod";
import { createRouter, authedQuery, directeurQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { companies } from "@db/schema";
import { eq } from "drizzle-orm";

export const companiesRouter = createRouter({
  // List all companies - any authenticated user
  list: authedQuery.query(async () => {
    const db = getDb();
    const result = await db.select().from(companies);
    return result;
  }),

  // Get single company
  get: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(companies)
        .where(eq(companies.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  // Create company - any authenticated user
  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1),
        notes: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(companies).values({
        name: input.name,
        notes: input.notes ?? "",
        color: input.color ?? "#1E3A5F",
        createdBy: ctx.user.id,
      });
      return { id: Number(result[0].insertId) };
    }),

  // Update company - directeur or admin only
  update: directeurQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        notes: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updates: Record<string, unknown> = {};
      if (input.name !== undefined) updates.name = input.name;
      if (input.notes !== undefined) updates.notes = input.notes;
      if (input.color !== undefined) updates.color = input.color;

      await db.update(companies).set(updates).where(eq(companies.id, input.id));
      return { success: true };
    }),

  // Delete company - directeur or admin only
  delete: directeurQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(companies).where(eq(companies.id, input.id));
      return { success: true };
    }),
});
