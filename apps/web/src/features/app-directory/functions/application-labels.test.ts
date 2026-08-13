import { describe, expect, it } from "vitest";
import type { Application } from "../types/application";
import { buildCategoryOptions } from "./application-labels";

const applications = [
  {
    category: "tool",
    description: "説明",
    host: "a.ex-foundry.com",
    name: "A",
    slug: "a",
    stack: [],
    status: "active",
  },
  {
    category: "tool",
    description: "説明",
    host: "b.ex-foundry.com",
    name: "B",
    slug: "b",
    stack: [],
    status: "active",
  },
  {
    category: "data",
    description: "説明",
    host: "c.ex-foundry.com",
    name: "C",
    slug: "c",
    stack: [],
    status: "beta",
  },
] as const satisfies readonly Application[];

describe("buildCategoryOptions", () => {
  it('puts "all" first with the total count', () => {
    const [first] = buildCategoryOptions(applications);

    expect(first).toEqual({ count: 3, label: "すべて", value: "all" });
  });

  it("omits categories with no applications", () => {
    const values = buildCategoryOptions(applications).map((option) => option.value);

    expect(values).toEqual(["all", "tool", "data"]);
  });

  it("counts applications per category", () => {
    const options = buildCategoryOptions(applications);

    expect(options.find((option) => option.value === "tool")?.count).toBe(2);
    expect(options.find((option) => option.value === "data")?.count).toBe(1);
  });

  it('returns only "all" for an empty catalogue', () => {
    expect(buildCategoryOptions([])).toEqual([{ count: 0, label: "すべて", value: "all" }]);
  });
});
