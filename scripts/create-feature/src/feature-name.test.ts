import { describe, expect, it } from "vitest";
import { parseFeatureName, toPascalCase } from "./feature-name";

describe("parseFeatureName", () => {
  it("accepts a kebab-case capability name", () => {
    expect(parseFeatureName("app-directory")).toEqual({ name: "app-directory", valid: true });
  });

  it("accepts a single word and digits", () => {
    expect(parseFeatureName("theme").valid).toBe(true);
    expect(parseFeatureName("oauth2-login").valid).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    expect(parseFeatureName("  theme  ")).toEqual({ name: "theme", valid: true });
  });

  it("rejects an empty name", () => {
    expect(parseFeatureName("   ").valid).toBe(false);
  });

  it("rejects names that are not kebab-case", () => {
    expect(parseFeatureName("AppDirectory").valid).toBe(false);
    expect(parseFeatureName("app_directory").valid).toBe(false);
    expect(parseFeatureName("app--directory").valid).toBe(false);
    expect(parseFeatureName("-theme").valid).toBe(false);
    expect(parseFeatureName("theme-").valid).toBe(false);
  });

  it("rejects names that describe no capability", () => {
    for (const name of ["utils", "common", "misc", "shared", "helpers"]) {
      expect(parseFeatureName(name).valid, name).toBe(false);
    }
  });

  it("rejects path traversal attempts", () => {
    expect(parseFeatureName("../secrets").valid).toBe(false);
    expect(parseFeatureName("a/b").valid).toBe(false);
  });
});

describe("toPascalCase", () => {
  it("joins kebab segments", () => {
    expect(toPascalCase("app-directory")).toBe("AppDirectory");
    expect(toPascalCase("theme")).toBe("Theme");
    expect(toPascalCase("oauth2-login")).toBe("Oauth2Login");
  });
});
