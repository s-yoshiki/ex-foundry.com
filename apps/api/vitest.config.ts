import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["src/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/lambda.ts", "src/local.ts", "src/**/*.test.ts"],
      reporter: ["text", "html"],
    },
  },
});
