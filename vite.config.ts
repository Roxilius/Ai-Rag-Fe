import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['6b45b2e7bce8.ngrok-free.app'],
    port: 5173,
    cors: true,
  },
});
