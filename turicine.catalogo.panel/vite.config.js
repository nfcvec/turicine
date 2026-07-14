import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-only proxy: the panel calls same-origin paths (/api, /odata) and Vite
// forwards them to the backend, so there is no CORS in development. In formal
// deployment the backend is mounted under the same site, so same-origin holds
// there too. This proxy config is dev tooling only; it is NOT part of the bundle.
const BACKEND_TARGET = process.env.VITE_DEV_BACKEND ?? "http://127.0.0.1:5099";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: BACKEND_TARGET, changeOrigin: true },
      "/odata": { target: BACKEND_TARGET, changeOrigin: true },
    },
  },
});
