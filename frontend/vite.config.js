// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // écoute tous les hôtes pour dev
  },
  preview: {
    allowedHosts: ['dakarbusinesse-1-54rq.onrender.com'], // autorise Render
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Sépare les libs node_modules dans un chunk 'vendor'
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // augmente limite pour éviter l'avertissement
  },
})
