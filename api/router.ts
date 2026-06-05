import { authRouter } from "./auth-router";
import { companiesRouter } from "./companies-router";
import { projectsRouter } from "./projects-router";
import { filesRouter } from "./files-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  companies: companiesRouter,
  projects: projectsRouter,
  files: filesRouter,
});

export type AppRouter = typeof appRouter;
