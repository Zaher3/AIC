/**
 * Auth API Routes
 * Current Status: Auth API route is done in /server/routes/auth.js
 * 
 * Endpoints:
 *   POST /api/auth/register  — Create new account
 *   POST /api/auth/login     — Login with email/password
 *   POST /api/auth/logout    — Clear session
 *   GET  /api/auth/me        — Get current user
 *   GET  /api/auth/team      — Get current user's team
 */
import express from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db.js";
import * as schema from "../../db/schema.js";
import { requireAuth, optionalAuth, generateToken } from "../middleware/auth.js";

const router = express.Router();

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "commercial", teamId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Password must be at least 6 characters",
      });
    }

    const db = await getDb();

    // Check if email already exists
    const existing = await db.query.users.findMany({
      where: eq(schema.users.email, email),
      limit: 1,
    });

    if (existing && existing.length > 0) {
      return res.status(409).json({
        error: "Conflict",
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.insert(schema.users).values({
      name,
      email,
      password: hashedPassword,
      role: ["commercial", "directeur", "admin"].includes(role) ? role : "commercial",
      teamId: teamId || null,
    });

    const userId = Number(result[0].insertId);

    // Generate JWT
    const token = generateToken(userId);

    // Return user data (without password)
    const newUser = await db.query.users.findMany({
      where: eq(schema.users.id, userId),
      limit: 1,
    });

    const { password: _, ...userWithoutPassword } = newUser[0];

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("[auth] Register error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create account",
    });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Email and password are required",
      });
    }

    const db = await getDb();

    const users = await db.query.users.findMany({
      where: eq(schema.users.email, email),
      limit: 1,
    });

    if (!users || users.length === 0) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("[auth] Login error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Login failed",
    });
  }
});

// ==================== LOGOUT ====================
router.post("/logout", requireAuth, async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// ==================== GET CURRENT USER (me) ====================
router.get("/me", optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Not authenticated",
        message: "No valid session found",
      });
    }

    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.error("[auth] Me error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch user",
    });
  }
});

// ==================== GET USER'S TEAM ====================
router.get("/team", requireAuth, async (req, res) => {
  try {
    if (!req.user.teamId) {
      return res.json({
        success: true,
        team: null,
        message: "User is not assigned to a team",
      });
    }

    const db = await getDb();
    const teams = await db.query.teams.findMany({
      where: eq(schema.teams.id, req.user.teamId),
      limit: 1,
    });

    res.json({
      success: true,
      team: teams && teams.length > 0 ? teams[0] : null,
    });
  } catch (err) {
    console.error("[auth] Team error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch team",
    });
  }
});

export default router;
