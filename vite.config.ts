import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Debe coincidir con "paths" en tsconfig.json — TypeScript solo
      // valida tipos, Vite necesita su propia resolución en runtime.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
