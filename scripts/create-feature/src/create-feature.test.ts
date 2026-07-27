import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createFeature, featureDirectory } from "./create-feature";

let root = "";

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "create-feature-"));
});

afterEach(async () => {
  await rm(root, { force: true, recursive: true });
});

describe("createFeature", () => {
  it("writes the starter files under the target app", async () => {
    const result = await createFeature({ app: "web", name: "app-directory", root });

    expect(result.ok).toBe(true);

    const directory = featureDirectory(root, "web", "app-directory");
    const type = await readFile(join(directory, "types/app-directory.ts"), "utf8");
    const component = await readFile(join(directory, "components/app-directory.tsx"), "utf8");

    expect(type).toContain("export type AppDirectoryItem");
    expect(component).toContain("export function AppDirectory()");
  });

  it("generates a test next to the function it covers", async () => {
    await createFeature({ app: "web", name: "theme", root });

    const directory = featureDirectory(root, "web", "theme");
    const test = await readFile(join(directory, "functions/get-theme-items.test.ts"), "utf8");

    expect(test).toContain('from "./get-theme-items"');
  });

  it("honours the --app target", async () => {
    await createFeature({ app: "admin", name: "theme", root });

    const type = await readFile(join(root, "apps/admin/src/features/theme/types/theme.ts"), "utf8");

    expect(type).toContain("ThemeItem");
  });

  it("rejects an invalid name without touching the filesystem", async () => {
    const result = await createFeature({ app: "web", name: "../escape", root });

    expect(result).toEqual({
      ok: false,
      reason: expect.stringContaining("kebab-case"),
    });
  });

  it("refuses to overwrite an existing file", async () => {
    const directory = featureDirectory(root, "web", "theme");

    await mkdir(join(directory, "types"), { recursive: true });
    await writeFile(join(directory, "types/theme.ts"), "// hand-written\n");

    const result = await createFeature({ app: "web", name: "theme", root });

    expect(result.ok).toBe(false);
    expect(await readFile(join(directory, "types/theme.ts"), "utf8")).toBe("// hand-written\n");
  });
});
