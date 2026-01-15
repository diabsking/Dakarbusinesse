import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, "src"), // dossier frontend contenant index.html et package.json
  build: {
    outDir: "../dist", // dossier de sortie final (à la racine)
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // alias @ pour pointer vers src/
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
