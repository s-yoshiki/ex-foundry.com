import type { ComponentPropsWithoutRef } from "react";
import { shouldLetBrowserHandle } from "./link-behavior";
import { useNavigation } from "./navigation-context";
import { routePath } from "./routes";
import type { RouteId } from "./types";

type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  replace?: boolean;
  /** Query string to append, including the leading "?". */
  search?: string;
  to: RouteId;
};

/**
 * In-app link. Routes are referenced by id, so a path change stays confined to
 * the route manifest, and the rendered element is always a real anchor.
 */
export function Link({ children, onClick, replace, search, target, to, ...props }: LinkProps) {
  const { navigate } = useNavigation();
  const href = `${routePath(to)}${search ?? ""}`;

  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (shouldLetBrowserHandle(event, target)) {
          return;
        }

        event.preventDefault();
        navigate(href, { replace });
      }}
      target={target}
      {...props}
    >
      {children}
    </a>
  );
}
