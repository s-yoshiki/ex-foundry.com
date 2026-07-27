import { describe, expect, it } from "vitest";
import { API_ROUTES, greetingPath, healthPath } from "./routes";

describe("healthPath", () => {
  it("matches the registered pattern", () => {
    expect(healthPath()).toBe(API_ROUTES.health);
  });
});

describe("greetingPath", () => {
  it("fills the name segment", () => {
    expect(greetingPath("Codex")).toBe("/api/greeting/Codex");
  });

  it("escapes characters that would change the path structure", () => {
    expect(greetingPath("a/b")).toBe("/api/greeting/a%2Fb");
    expect(greetingPath("a b")).toBe("/api/greeting/a%20b");
  });

  it("escapes non-ASCII names", () => {
    expect(greetingPath("さくら")).toBe(`/api/greeting/${encodeURIComponent("さくら")}`);
  });
});
