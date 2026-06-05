import express from "express";
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db.js";
import * as schema from "../../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const allUsers = await db.query.users.findMany({
      columns: { password: false },
      with: { team: true },
    });
    res.json({ success: true, users: allUsers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.query.users.findMany({
      where: eq(schema.users.id, parseInt(req.params.id)),
      columns: { password: false },
      with: { team: true },
      limit: 1,
    });
    if (!user || user.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user: user[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const updates = {};
    if (req.body.role) updates.role = req.body.role;
    if (req.body.teamId !== undefined) updates.teamId = req.body.teamId;
    await db.update(schema.users).set(updates).where(eq(schema.users.id, parseInt(req.params.id)));
    const updated = await db.query.users.findMany({
      where: eq(schema.users.id, parseInt(req.params.id)),
      columns: { password: false },
      limit: 1,
    });
    res.json({ success: true, user: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
