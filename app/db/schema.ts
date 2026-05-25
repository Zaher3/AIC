import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";

// ==================== USERS ====================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["commercial", "directeur", "admin"])
    .default("commercial")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== COMPANIES ====================
export const companies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  notes: text("notes"),
  color: varchar("color", { length: 7 }).default("#1E3A5F").notNull(),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true })
    .references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Company = typeof companies.$inferSelect;

// ==================== PROJECTS ====================
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull(), // e.g. "AIM-2024-001"
  name: varchar("name", { length: 255 }).notNull(),
  companyId: bigint("companyId", { mode: "number", unsigned: true })
    .references(() => companies.id)
    .notNull(),
  ownerId: bigint("ownerId", { mode: "number", unsigned: true })
    .references(() => users.id)
    .notNull(),
  status: mysqlEnum("status", ["active", "won", "lost", "archived"])
    .default("active")
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;

// ==================== PROJECT FILES ====================
export const projectFiles = mysqlTable("projectFiles", {
  id: serial("id").primaryKey(),
  projectId: bigint("projectId", { mode: "number", unsigned: true })
    .references(() => projects.id)
    .notNull(),
  stepId: varchar("stepId", { length: 50 }).notNull(), // e.g. "reception", "chiffrage"
  name: varchar("name", { length: 255 }).notNull(),
  fileType: mysqlEnum("fileType", ["pdf", "doc", "xls", "image", "other"])
    .default("other")
    .notNull(),
  size: varchar("size", { length: 50 }),
  date: varchar("date", { length: 10 }),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true })
    .references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectFile = typeof projectFiles.$inferSelect;

// ==================== PROJECT MEMBERS (Sharing & Permissions) ====================
// Tracks who has access to which project and at what level
export const projectMembers = mysqlTable("projectMembers", {
  id: serial("id").primaryKey(),
  projectId: bigint("projectId", { mode: "number", unsigned: true })
    .references(() => projects.id)
    .notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .references(() => users.id)
    .notNull(),
  permission: mysqlEnum("permission", [
    "owner",    // Full control (creator)
    "editor",   // Can edit (authorized by owner)
    "viewer",   // Can view only (authorized by owner/director)
    "pending",  // Requested access, waiting for approval
  ])
    .default("viewer")
    .notNull(),
  grantedBy: bigint("grantedBy", { mode: "number", unsigned: true })
    .references(() => users.id), // Who gave this permission
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectMember = typeof projectMembers.$inferSelect;
