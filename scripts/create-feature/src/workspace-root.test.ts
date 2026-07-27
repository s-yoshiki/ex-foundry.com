import { describe, expect, it } from "vitest";
import { findWorkspaceRoot } from "./workspace-root";

function existsIn(...markerDirectories: string[]) {
  return (path: string) => markerDirectories.some((dir) => path === `${dir}/pnpm-workspace.yaml`);
}

describe("findWorkspaceRoot", () => {
  it("returns the starting directory when the marker is there", () => {
    expect(findWorkspaceRoot("/repo", existsIn("/repo"))).toBe("/repo");
  });

  it("walks up from a nested package directory", () => {
    expect(findWorkspaceRoot("/repo/scripts/create-feature", existsIn("/repo"))).toBe("/repo");
  });

  it("stops at the filesystem root when no marker exists", () => {
    expect(findWorkspaceRoot("/somewhere/else", existsIn("/repo"))).toBeUndefined();
  });

  it("picks the nearest marker", () => {
    expect(findWorkspaceRoot("/repo/nested/pkg", existsIn("/repo", "/repo/nested"))).toBe(
      "/repo/nested",
    );
  });
});
