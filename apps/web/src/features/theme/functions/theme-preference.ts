import type { ResolvedTheme, ThemePreference } from "../types/theme";

/** Kept in sync with the bootstrap script in `index.html`. */
export const THEME_STORAGE_KEY = "ex-foundry:theme";

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

/**
 * Reads the stored preference. Web Storage is an untrusted boundary: it can hold
 * anything a previous version wrote, and it throws outright when the browser
 * blocks storage access.
 */
export function readThemePreference(storage: Pick<Storage, "getItem">): ThemePreference {
  try {
    const stored: unknown = storage.getItem(THEME_STORAGE_KEY);

    return isThemePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function writeThemePreference(
  storage: Pick<Storage, "setItem">,
  preference: ThemePreference,
): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage is unavailable (private mode, blocked cookies). The in-memory
    // preference still applies for this page view.
  }
}

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  if (preference === "system") {
    return prefersDark ? "dark" : "light";
  }

  return preference;
}

export function applyTheme(element: HTMLElement, theme: ResolvedTheme): void {
  element.dataset.theme = theme;
}

export function prefersDarkScheme(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }

  return window.matchMedia(DARK_SCHEME_QUERY).matches;
}
