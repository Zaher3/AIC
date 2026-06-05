/**
 * Database Seed Script
 * Creates initial teams and demo users for development/testing
 * 
 * Usage: node server/seed.js
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { getDb, getConnection } from "./lib/db.js";
import * as schema from "../db/schema.js";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("[seed] Starting database seed...");

  const db = await getDb();

  // Check if teams already exist
  const existingTeams = await db.query.teams.findMany();
  if (existingTeams.length > 0) {
    console.log("[seed] Teams already exist, skipping seed.");
    console.log(`[seed] Found ${existingTeams.length} team(s).`);
    process.exit(0);
  }

  // Create teams
  console.log("[seed] Creating teams...");
  const teamResult1 = await db.insert(schema.teams).values({
    name: "Equipe Commerciale 1",
    description: "Service commercial et estimation - Zone Nord",
  });
  const team1Id = Number(teamResult1[0].insertId);

  const teamResult2 = await db.insert(schema.teams).values({
    name: "Equipe Commerciale 2",
    description: "Service commercial et estimation - Zone Sud",
  });
  const team2Id = Number(teamResult2[0].insertId);

  console.log(`[seed] Created teams: Eq.1 (id=${team1Id}), Eq.2 (id=${team2Id})`);

  // Create demo users with hashed passwords
  const defaultPassword = await bcrypt.hash("demo123", 10);

  const users = [
    { name: "Karim Benali", email: "directeur@demo.com", role: "directeur", teamId: null },
    { name: "Sara El Amrani", email: "resp1@demo.com", role: "directeur", teamId: team1Id },
    { name: "Youssef Idrissi", email: "resp2@demo.com", role: "directeur", teamId: team2Id },
    { name: "Fatima Zahra", email: "com1@demo.com", role: "commercial", teamId: team1Id },
    { name: "Omar Farouk", email: "com2@demo.com", role: "commercial", teamId: team1Id },
    { name: "Laila Bennani", email: "com3@demo.com", role: "commercial", teamId: team2Id },
    { name: "Hassan Moussaoui", email: "com4@demo.com", role: "commercial", teamId: team2Id },
  ];

  console.log("[seed] Creating users...");
  for (const user of users) {
    await db.insert(schema.users).values({
      ...user,
      password: defaultPassword,
    });
    console.log(`[seed]   - ${user.name} (${user.email})`);
  }

  console.log("[seed] Done! Created 2 teams and 7 users.");
  console.log("[seed] Default password for all demo users: demo123");

  // Close connection
  const conn = await getConnection();
  await conn.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
