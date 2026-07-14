import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dev-only: proxy the public BFF to the local backend so the landing calls
  // same-origin `/api` (no CORS). In production the origin site proxies `/api`.
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api': 'http://127.0.0.1:5099',
    },
  },
})
