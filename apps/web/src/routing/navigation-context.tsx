import { createContext, useContext } from "react";
import type { NavigationPort } from "./types";

const NavigationContext = createContext<NavigationPort | undefined>(undefined);

export function NavigationProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: NavigationPort;
}) {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

/** Access to navigation. The only routing API components are allowed to use. */
export function useNavigation(): NavigationPort {
  const port = useContext(NavigationContext);

  if (port === undefined) {
    throw new Error("useNavigation must be used inside a NavigationProvider.");
  }

  return port;
}
