/**
 * Cartographie Collaborative — Express Server Entry Point
 * 
 * Current Status: 
 *   - DB has Users & Teams tables
 *   - Auth API route is done in /server/routes/auth.js
 *   - Frontend login page is being built
 * 
 * Stack: Express + Drizzle ORM + MySQL + JWT
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import teamsRoutes from "./routes/teams.js";
import usersRoutes from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ======== MIDDLEWARE ========
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ======== API ROUTES ========
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development",
    version: "1.0.0",
    features: ["auth", "teams", "users"],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/users", usersRoutes);

// ======== FRONTEND (production) ========
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../dist/public");
  app.use(express.static(staticPath));
  app.get("/{*path}", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(staticPath, "index.html"));
    }
  });
}

// ======== ERROR HANDLING ========
app.use("/api/*path", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/logout",
      "GET  /api/auth/me",
      "GET  /api/auth/team",
      "GET  /api/teams",
      "POST /api/teams",
      "GET  /api/teams/:id",
      "GET  /api/users",
      "GET  /api/users/:id",
      "GET  /api/health",
    ],
  });
});

app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
  });
});

// ======== START SERVER ========
app.listen(PORT, () => {
  console.log("═══════════════════════════════════════════");
  console.log("  Cartographie Collaborative Server");
  console.log("═══════════════════════════════════════════");
  console.log(`  Port:     ${PORT}`);
  console.log(`  Env:      ${process.env.NODE_ENV || "development"}`);
  console.log(`  Database: ${process.env.DATABASE_URL ? "Connected" : "Missing DATABASE_URL"}`);
  console.log(`  Auth:     /api/auth`);
  console.log(`  Teams:    /api/teams`);
  console.log(`  Users:    /api/users`);
  console.log(`  Health:   /api/health`);
  console.log("═══════════════════════════════════════════");
  console.log(`  Server running on http://localhost:${PORT}/`);
  console.log("═══════════════════════════════════════════");
});

export default app;
