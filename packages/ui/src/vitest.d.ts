import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Matchers<T = unknown> extends TestingLibraryMatchers<T, void> {}
}
