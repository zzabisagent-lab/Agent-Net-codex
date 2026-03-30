import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api/v1": "http://localhost:5000",
      "/health/live": "http://localhost:5000",
      "/health/ready": "http://localhost:5000",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});
