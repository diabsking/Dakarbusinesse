import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // expose le serveur à Render
    port: process.env.PORT || 5173, // utilise le port fourni par Render
    open: false,          // ne pas ouvrir automatiquement le navigateur sur Render
  },
  preview: {
    host: true,           // expose le serveur de preview à Render
    allowedHosts: "all",  // autorise tous les hôtes (ou liste ton domaine exact)
  },
});
