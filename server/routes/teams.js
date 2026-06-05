import express from "express";
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db.js";
import * as schema from "../../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const allTeams = await db.query.teams.findMany({
      with: {
        members: { columns: { password: false } },
      },
    });
    res.json({ success: true, teams: allTeams });
  } catch (err) {
    console.error("[teams] List error:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    const team = await db.query.teams.findMany({
      where: eq(schema.teams.id, parseInt(req.params.id)),
      with: { members: { columns: { password: false } } },
      limit: 1,
    });
    if (!team || team.length === 0) return res.status(404).json({ error: "Team not found" });
    res.json({ success: true, team: team[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Team name is required" });
    const db = await getDb();
    const result = await db.insert(schema.teams).values({ name, description: description || null });
    const newTeam = await db.query.teams.findMany({
      where: eq(schema.teams.id, Number(result[0].insertId)),
      limit: 1,
    });
    res.status(201).json({ success: true, team: newTeam[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to create team" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    await db.update(schema.teams).set(req.body).where(eq(schema.teams.id, parseInt(req.params.id)));
    const updated = await db.query.teams.findMany({
      where: eq(schema.teams.id, parseInt(req.params.id)),
      limit: 1,
    });
    res.json({ success: true, team: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update team" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    await db.update(schema.users).set({ teamId: null }).where(eq(schema.users.teamId, parseInt(req.params.id)));
    await db.delete(schema.teams).where(eq(schema.teams.id, parseInt(req.params.id)));
    res.json({ success: true, message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete team" });
  }
});

export default router;
