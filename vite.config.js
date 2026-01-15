import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, "."), // le dossier où se trouve index.html et package.json
  build: {
    outDir: "dist", // dossier de sortie pour le build
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
