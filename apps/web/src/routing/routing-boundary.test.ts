import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Vitest runs with the package directory as the working directory.
const SOURCE_ROOT = join(process.cwd(), "src");
const ADAPTER_DIRECTORY = join(SOURCE_ROOT, "routing", "adapters");
const ROUTER_PACKAGES = ["react-router", "@tanstack/react-router", "wouter"];

async function collectSourceFiles(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(path)));
    } else if (/\.tsx?$/.test(entry.name)) {
      files.push(path);
    }
  }

  return files;
}

function importsRouter(source: string): boolean {
  return ROUTER_PACKAGES.some((pkg) =>
    new RegExp(`from\\s+["']${pkg.replace("/", "\\/")}["']`).test(source),
  );
}

/**
 * The point of the routing port is that swapping routers touches one directory.
 * This test fails the moment that stops being true.
 */
describe("routing boundary", () => {
  it("confines router imports to routing/adapters and main.tsx", async () => {
    const files = await collectSourceFiles(SOURCE_ROOT);
    const offenders: string[] = [];

    for (const file of files) {
      if (file.startsWith(ADAPTER_DIRECTORY) || file.endsWith("routing-boundary.test.ts")) {
        continue;
      }

      const source = await readFile(file, "utf8");

      if (importsRouter(source) && !file.endsWith("main.tsx")) {
        offenders.push(relative(SOURCE_ROOT, file));
      }
    }

    expect(offenders).toEqual([]);
  });

  it("checks a meaningful number of files", async () => {
    const files = await collectSourceFiles(SOURCE_ROOT);

    expect(files.length).toBeGreaterThan(20);
  });

  it("would catch a router import outside the adapters", () => {
    expect(importsRouter('import { useNavigate } from "react-router";')).toBe(true);
    expect(importsRouter('import { useNavigation } from "../routing/navigation-context";')).toBe(
      false,
    );
  });
});
