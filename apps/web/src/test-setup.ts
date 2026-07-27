import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// `@testing-library/jest-dom/vitest` imports `vitest` from its own package
// directory, which pnpm's isolated node_modules does not expose. Registering the
// standalone matchers avoids that resolution problem.
expect.extend(matchers);

// Testing Library only auto-registers cleanup when Vitest globals are enabled.
afterEach(cleanup);

/**
 * Vitest copies a fixed list of window properties onto the global object, and
 * `localStorage` is not on it — so `window.localStorage` is undefined in tests
 * regardless of the DOM implementation. This restores it with an equivalent
 * in-memory store so the code under test exercises its real storage path.
 */
class MemoryStorage {
  #entries = new Map<string, string>();

  get length(): number {
    return this.#entries.size;
  }

  clear(): void {
    this.#entries.clear();
  }

  getItem(key: string): string | null {
    return this.#entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#entries.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#entries.set(key, String(value));
  }
}

// Node declares a `localStorage` global that stays undefined unless Web Storage
// is enabled, so the value — not the key — decides whether a stand-in is needed.
if (typeof globalThis.localStorage === "undefined") {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: new MemoryStorage() as unknown as Storage,
  });
}
