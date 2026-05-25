import { relations } from "drizzle-orm";
import { users, companies, projects, projectFiles, projectMembers } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects, { relationName: "owner" }),
  createdCompanies: many(companies, { relationName: "creator" }),
  memberships: many(projectMembers),
}));

export const companiesRelations = relations(companies, ({ many, one }) => ({
  creator: one(users, {
    fields: [companies.createdBy],
    references: [users.id],
    relationName: "creator",
  }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, {
    fields: [projects.companyId],
    references: [companies.id],
  }),
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  files: many(projectFiles),
  members: many(projectMembers),
}));

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.projectId],
    references: [projects.id],
  }),
  creator: one(users, {
    fields: [projectFiles.createdBy],
    references: [users.id],
  }),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
  granter: one(users, {
    fields: [projectMembers.grantedBy],
    references: [users.id],
  }),
}));
