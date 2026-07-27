import { describe, expect, it } from "vitest";
import { canonicalUrl, findRoute, matchRoute, ROUTES, routePath } from "./routes";

describe("ROUTES", () => {
  it("declares unique ids and paths", () => {
    expect(new Set(ROUTES.map((route) => route.id)).size).toBe(ROUTES.length);
    expect(new Set(ROUTES.map((route) => route.path)).size).toBe(ROUTES.length);
  });

  it("uses absolute paths", () => {
    for (const route of ROUTES) {
      expect(route.path.startsWith("/"), route.path).toBe(true);
    }
  });

  it("gives every route a title and description for the document head", () => {
    for (const route of ROUTES) {
      expect(route.title.length, route.id).toBeGreaterThan(0);
      expect(route.description.length, route.id).toBeGreaterThan(0);
    }
  });
});

describe("findRoute", () => {
  it("returns the matching route", () => {
    expect(findRoute("about").path).toBe("/about");
  });

  it("throws for an unknown id", () => {
    // @ts-expect-error the id is intentionally outside RouteId
    expect(() => findRoute("nope")).toThrow(/Unknown route id/);
  });
});

describe("routePath", () => {
  it("resolves an id to its path", () => {
    expect(routePath("home")).toBe("/");
  });
});

describe("matchRoute", () => {
  it("matches an exact path", () => {
    expect(matchRoute("/about")?.id).toBe("about");
    expect(matchRoute("/")?.id).toBe("home");
  });

  it("tolerates a trailing slash", () => {
    expect(matchRoute("/about/")?.id).toBe("about");
  });

  it("returns undefined for an unknown path", () => {
    expect(matchRoute("/nope")).toBeUndefined();
  });
});

describe("canonicalUrl", () => {
  it("builds an absolute URL", () => {
    expect(canonicalUrl("/")).toBe("https://ex-foundry.com/");
    expect(canonicalUrl("/about")).toBe("https://ex-foundry.com/about");
  });
});
