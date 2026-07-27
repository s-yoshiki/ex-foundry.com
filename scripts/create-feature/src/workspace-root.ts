import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";

const WORKSPACE_MARKER = "pnpm-workspace.yaml";

/**
 * Walks up from `startDirectory` to the directory holding `pnpm-workspace.yaml`.
 *
 * pnpm runs package scripts with the package directory as the working
 * directory, so the repository root has to be discovered rather than assumed.
 */
export function findWorkspaceRoot(
  startDirectory: string,
  exists: (path: string) => boolean = existsSync,
): string | undefined {
  const { root } = parse(startDirectory);
  let current = startDirectory;

  while (true) {
    if (exists(join(current, WORKSPACE_MARKER))) {
      return current;
    }

    if (current === root) {
      return undefined;
    }

    current = dirname(current);
  }
}
