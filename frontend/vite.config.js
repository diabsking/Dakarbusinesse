// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou ce que tu utilises

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  preview: {
    // autoriser le domaine Render
    allowedHosts: ['dakarbusinesse-1.onrender.com'],
  },
})
