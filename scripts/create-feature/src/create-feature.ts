import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { parseFeatureName } from "./feature-name";
import { buildFeatureFiles } from "./templates";

export type CreateFeatureOptions = {
  /** Workspace root, used to resolve the target app. */
  root: string;
  app: string;
  name: string;
};

export type CreateFeatureResult =
  | { createdFiles: readonly string[]; ok: true }
  | { ok: false; reason: string };

export function featureDirectory(root: string, app: string, name: string): string {
  return join(root, "apps", app, "src", "features", name);
}

/**
 * Writes the starter files for a new feature. Existing files are never
 * overwritten — the command fails instead, so a typo cannot destroy work.
 */
export async function createFeature({
  app,
  name,
  root,
}: CreateFeatureOptions): Promise<CreateFeatureResult> {
  const parsed = parseFeatureName(name);

  if (!parsed.valid) {
    return { ok: false, reason: parsed.reason };
  }

  const directory = featureDirectory(root, app, parsed.name);
  const files = buildFeatureFiles(parsed.name);
  const createdFiles: string[] = [];

  for (const file of files) {
    const target = join(directory, file.path);

    await mkdir(dirname(target), { recursive: true });

    try {
      await writeFile(target, file.contents, { encoding: "utf8", flag: "wx" });
    } catch (error) {
      if (isFileExistsError(error)) {
        return { ok: false, reason: `${target} は既に存在します。` };
      }

      throw error;
    }

    createdFiles.push(target);
  }

  return { createdFiles, ok: true };
}

function isFileExistsError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "EEXIST"
  );
}
