import { type ReactNode, useMemo, useState } from "react";
import { NavigationProvider } from "../../navigation-context";
import type { LocationSnapshot, NavigationPort } from "../../types";

function splitUrl(url: string): LocationSnapshot {
  const [pathname = "/", query] = url.split("?");

  return { pathname, search: query === undefined ? "" : `?${query}` };
}

/**
 * In-memory implementation of the navigation port.
 *
 * Used by tests, and as the reference for what an adapter has to provide: two
 * values and one function. Anything a router needs beyond this belongs inside
 * that router's own adapter.
 */
export function MemoryNavigationProvider({
  children,
  initialUrl = "/",
  onNavigate,
}: {
  children: ReactNode;
  initialUrl?: string;
  onNavigate?: (url: string) => void;
}) {
  const [url, setUrl] = useState(initialUrl);

  const port = useMemo<NavigationPort>(
    () => ({
      location: splitUrl(url),
      navigate: (to) => {
        setUrl(to);
        onNavigate?.(to);
      },
    }),
    [onNavigate, url],
  );

  return <NavigationProvider value={port}>{children}</NavigationProvider>;
}
