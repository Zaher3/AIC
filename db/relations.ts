import { relations } from "drizzle-orm";
import { users, teams } from "./schema";

/**
 * Current Status: DB has Users & Teams tables.
 * Relations between users and their teams.
 */

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
}));
