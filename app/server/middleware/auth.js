/**
 * Auth Middleware — JWT verification
 * Validates Bearer token from Authorization header
 */
import jwt from "jsonwebtoken";
import { getDb } from "../lib/db.js";
import * as schema from "../../db/schema.js";
import { eq } from "drizzle-orm";

// Use APP_SECRET as JWT secret
const JWT_SECRET = process.env.APP_SECRET || process.env.JWT_SECRET || "dev-secret-change-in-production";

/**
 * Verify JWT token and attach user to req
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Missing or invalid Authorization header. Use: Bearer <token>",
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from database
    const db = await getDb();
    const users = await db.query.users.findMany({
      where: eq(schema.users.id, decoded.userId),
      limit: 1,
    });

    if (!users || users.length === 0) {
      return res.status(401).json({
        error: "Authentication required",
        message: "User not found. Token may be expired.",
      });
    }

    // Attach user to request (excluding password)
    const { password, ...userWithoutPassword } = users[0];
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    console.error("[auth] JWT verification failed:", err.message);
    return res.status(401).json({
      error: "Authentication required",
      message: "Invalid or expired token",
    });
  }
}

/**
 * Optional auth — attaches user if token present, doesn't reject if missing
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = await getDb();
    const users = await db.query.users.findMany({
      where: eq(schema.users.id, decoded.userId),
      limit: 1,
    });

    if (users && users.length > 0) {
      const { password, ...userWithoutPassword } = users[0];
      req.user = userWithoutPassword;
    }
    next();
  } catch {
    next();
  }
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
