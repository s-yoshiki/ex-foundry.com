/**
 * Route paths shared by the server and its clients.
 *
 * The server registers the pattern, the client builds a concrete path with the
 * matching helper. Keeping both here means a renamed route breaks the build on
 * both sides instead of at runtime.
 */
export const API_ROUTES = {
  greeting: "/api/greeting/:name",
  health: "/health",
} as const;

export function healthPath(): string {
  return API_ROUTES.health;
}

export function greetingPath(name: string): string {
  return `/api/greeting/${encodeURIComponent(name)}`;
}
