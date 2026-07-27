import type { ReactNode } from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { NavigationProvider } from "../../navigation-context";
import type { NavigationPort } from "../../types";

/** Fulfils the navigation port with React Router's hooks. */
export function ReactRouterNavigationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const port = useMemo<NavigationPort>(
    () => ({
      location: { pathname: location.pathname, search: location.search },
      navigate: (to, options) => {
        void navigate(to, { replace: options?.replace ?? false });
      },
    }),
    [location.pathname, location.search, navigate],
  );

  return <NavigationProvider value={port}>{children}</NavigationProvider>;
}
