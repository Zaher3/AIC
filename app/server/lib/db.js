/**
 * Database connection for Express server
 * Uses Drizzle ORM with mysql2 driver
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../db/schema.js";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("[db] FATAL: DATABASE_URL environment variable is required");
  process.exit(1);
}

let connection;
let db;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log("[db] Connected to MySQL database");
  }
  return connection;
}

export async function getDb() {
  if (!db) {
    const conn = await getConnection();
    db = drizzle(conn, { schema, mode: "planetscale" });
  }
  return db;
}
