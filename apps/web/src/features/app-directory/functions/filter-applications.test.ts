import { describe, expect, it } from "vitest";
import type { Application } from "../types/application";
import { filterApplications, toSearchTerms } from "./filter-applications";

const applications = [
  {
    category: "tool",
    description: "変換ツール",
    host: "devtoys.ex-foundry.com",
    name: "DevToys for web",
    stack: ["React", "Vite"],
    status: "active",
  },
  {
    category: "data",
    description: "プロ野球の成績を可視化",
    host: "npb-analysis.ex-foundry.com",
    name: "NPB Analysis",
    stack: ["React", "D3"],
    status: "beta",
  },
] as const satisfies readonly Application[];

describe("toSearchTerms", () => {
  it("returns no terms for blank input", () => {
    expect(toSearchTerms("   ")).toEqual([]);
  });

  it("lowercases and splits on runs of whitespace", () => {
    expect(toSearchTerms("  React   VITE ")).toEqual(["react", "vite"]);
  });
});

describe("filterApplications", () => {
  it("returns everything when unfiltered", () => {
    expect(filterApplications(applications, { category: "all", query: "" })).toHaveLength(2);
  });

  it("filters by category", () => {
    const result = filterApplications(applications, { category: "data", query: "" });

    expect(result.map((application) => application.name)).toEqual(["NPB Analysis"]);
  });

  it("matches the name case-insensitively", () => {
    const result = filterApplications(applications, { category: "all", query: "devtoys" });

    expect(result).toHaveLength(1);
  });

  it("matches the description, host, and stack", () => {
    expect(filterApplications(applications, { category: "all", query: "野球" })).toHaveLength(1);
    expect(
      filterApplications(applications, { category: "all", query: "npb-analysis" }),
    ).toHaveLength(1);
    expect(filterApplications(applications, { category: "all", query: "d3" })).toHaveLength(1);
  });

  it("requires every term to match", () => {
    expect(filterApplications(applications, { category: "all", query: "react vite" })).toHaveLength(
      1,
    );
    expect(filterApplications(applications, { category: "all", query: "react rust" })).toHaveLength(
      0,
    );
  });

  it("combines category and query", () => {
    expect(filterApplications(applications, { category: "tool", query: "野球" })).toHaveLength(0);
  });
});
