export type RouteId =
  | "home"
  | "apps"
  | "about"
  | "articles"
  | "privacy"
  | "contact"
  | "editorialPolicy";

/**
 * Everything about a route that is not a React component.
 *
 * Kept free of imports so the Vite build can read the manifest without pulling
 * the application bundle into the build configuration.
 */
export type RouteMeta = {
  description: string;
  id: RouteId;
  /** Absolute path, always starting with "/". */
  path: string;
  /** Label used in the site navigation. */
  navLabel: string;
  title: string;
};

export type LocationSnapshot = {
  pathname: string;
  /** Raw query string including the leading "?", or "" when absent. */
  search: string;
};

export type NavigateOptions = {
  replace?: boolean;
};

/**
 * The whole routing surface the application is allowed to depend on.
 *
 * Adapters under `routing/adapters/` implement this with a concrete router.
 * Nothing else in `src/` may import a routing library — see
 * `routing/routing-boundary.test.ts`.
 */
export type NavigationPort = {
  location: LocationSnapshot;
  navigate: (to: string, options?: NavigateOptions) => void;
};
