/** What the user asked for. `"system"` follows the operating system. */
export type ThemePreference = "system" | "light" | "dark";

/** What is actually painted, after resolving `"system"`. */
export type ResolvedTheme = "light" | "dark";
