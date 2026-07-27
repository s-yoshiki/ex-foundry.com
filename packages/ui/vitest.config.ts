import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      include: ["src/**/*.tsx"],
      exclude: ["src/**/*.test.tsx"],
      reporter: ["text", "html"],
    },
  },
});
