import { describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  isThemePreference,
  readThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  writeThemePreference,
} from "./theme-preference";

describe("isThemePreference", () => {
  it("accepts the three known values", () => {
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isThemePreference(null)).toBe(false);
    expect(isThemePreference("solarized")).toBe(false);
    expect(isThemePreference(1)).toBe(false);
  });
});

describe("readThemePreference", () => {
  it("returns the stored value when it is valid", () => {
    const storage = { getItem: vi.fn().mockReturnValue("light") };

    expect(readThemePreference(storage)).toBe("light");
    expect(storage.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it('falls back to "system" for unknown stored values', () => {
    expect(readThemePreference({ getItem: () => "sepia" })).toBe("system");
    expect(readThemePreference({ getItem: () => null })).toBe("system");
  });

  it('falls back to "system" when storage access throws', () => {
    expect(
      readThemePreference({
        getItem: () => {
          throw new Error("storage blocked");
        },
      }),
    ).toBe("system");
  });
});

describe("writeThemePreference", () => {
  it("stores the preference under the shared key", () => {
    const storage = { setItem: vi.fn() };

    writeThemePreference(storage, "dark");

    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "dark");
  });

  it("swallows storage errors", () => {
    expect(() =>
      writeThemePreference(
        {
          setItem: () => {
            throw new Error("storage blocked");
          },
        },
        "dark",
      ),
    ).not.toThrow();
  });
});

describe("resolveTheme", () => {
  it("follows the system for the system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("ignores the system for explicit preferences", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("applyTheme", () => {
  it("writes the theme onto the element", () => {
    const element = document.createElement("div");

    applyTheme(element, "light");

    expect(element.dataset.theme).toBe("light");
  });
});
