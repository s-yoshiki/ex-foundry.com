import { describe, expect, it } from "vitest";
import {
  parseApplicationSearchParams,
  toApplicationSearchString,
} from "./application-search-params";

describe("parseApplicationSearchParams", () => {
  it("defaults to an unfiltered view", () => {
    expect(parseApplicationSearchParams("")).toEqual({ category: "all", query: "" });
  });

  it("reads a query and a category", () => {
    expect(parseApplicationSearchParams("?q=react&category=tool")).toEqual({
      category: "tool",
      query: "react",
    });
  });

  it("decodes percent-encoded queries", () => {
    expect(parseApplicationSearchParams("?q=%E9%87%8E%E7%90%83").query).toBe("野球");
  });

  it("falls back to the default for an unknown category", () => {
    expect(parseApplicationSearchParams("?category=nonsense").category).toBe("all");
  });

  it("drops an over-long query instead of rejecting the URL", () => {
    const search = `?q=${"a".repeat(200)}`;

    expect(parseApplicationSearchParams(search).query).toBe("");
  });

  it("ignores unrelated params", () => {
    expect(parseApplicationSearchParams("?utm_source=x")).toEqual({
      category: "all",
      query: "",
    });
  });
});

describe("toApplicationSearchString", () => {
  it("omits defaults", () => {
    expect(toApplicationSearchString({ category: "all", query: "" })).toBe("");
    expect(toApplicationSearchString({ category: "all", query: "   " })).toBe("");
  });

  it("serialises an active filter", () => {
    expect(toApplicationSearchString({ category: "tool", query: "react" })).toBe(
      "?q=react&category=tool",
    );
  });

  it("round-trips through the parser", () => {
    const filter = { category: "data", query: "野球 成績" } as const;

    expect(parseApplicationSearchParams(toApplicationSearchString(filter))).toEqual(filter);
  });
});
