import { defineConfig } from "drizzle-kit";
import { createRequire } from "module";

// En local : charge .env si présent
// En production (Railway) : les variables sont déjà injectées
if (process.env.NODE_ENV !== "production") {
  try {
    const require = createRequire(import.meta.url);
    require("dotenv/config");
  } catch {
    // dotenv non installé ou .env manquant — ignore
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required to run drizzle commands.\n" +
    "Local : créez un fichier .env avec DATABASE_URL=...\n" +
    "Railway : ajoutez DATABASE_URL dans les variables d'environnement du service."
  );
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
