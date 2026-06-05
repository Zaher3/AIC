import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = loadEnv("", process.cwd(), "");

const OUT_DIR = "dist/public";

export default defineConfig({
  envDir: path.resolve(__dirname),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@db": path.resolve(__dirname, "./db"),
      "@server": path.resolve(__dirname, "./server"),
      "@contracts": path.resolve(__dirname, "./contracts"),
    },
  },
  define: {
    "import.meta.env.VITE_APP_ID": JSON.stringify(
      env.APP_ID ?? env.VITE_APP_ID ?? "",
    ),
  },
  plugins: [react()],
  build: {
    outDir: OUT_DIR,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
    port: 5173,
  },
});
