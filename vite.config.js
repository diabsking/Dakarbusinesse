import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  // root: resolve(__dirname, "src"), // retiré pour éviter src/src
  build: {
    outDir: resolve(__dirname, "dist"), // sortie finale à la racine
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // @ pointe vers src/
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
