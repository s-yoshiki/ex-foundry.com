/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { blogContent } from "./plugins/blog-content";
import { staticRoutes } from "./plugins/static-routes";
import { structuredData } from "./plugins/structured-data";

export default defineConfig({
  plugins: [tailwindcss(), react(), blogContent(), structuredData(), staticRoutes()],
  test: {
    css: false,
    environment: "happy-dom",
    globals: false,
    include: ["src/**/*.test.{ts,tsx}", "plugins/**/*.test.ts"],
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      include: ["src/**/*.{ts,tsx}", "plugins/**/*.ts"],
      exclude: ["src/main.tsx", "src/test-setup.ts", "src/**/*.test.{ts,tsx}"],
      reporter: ["text", "html"],
    },
  },
});
