import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  DARK_SCHEME_QUERY,
  prefersDarkScheme,
  readThemePreference,
  resolveTheme,
  writeThemePreference,
} from "../functions/theme-preference";
import type { ThemePreference } from "../types/theme";

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readThemePreference(window.localStorage),
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState(prefersDarkScheme);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(DARK_SCHEME_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const theme = resolveTheme(preference, systemPrefersDark);

  useEffect(() => {
    applyTheme(document.documentElement, theme);
  }, [theme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    writeThemePreference(window.localStorage, next);
  }, []);

  return { preference, setPreference, theme };
}
