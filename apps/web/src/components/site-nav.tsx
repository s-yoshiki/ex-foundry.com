import { cn } from "@repo/ui";
import { Link } from "../routing/link";
import { useNavigation } from "../routing/navigation-context";
import { matchRoute, ROUTES } from "../routing/routes";

export function SiteNav() {
  const { location } = useNavigation();
  const active = matchRoute(location.pathname);
  const activeId = location.pathname.startsWith("/entry/")
    ? "home"
    : location.pathname.startsWith("/products/")
      ? "apps"
      : active?.id;
  const visibleRoutes = ROUTES.filter(
    (route) =>
      route.id === "home" ||
      route.id === "apps" ||
      route.id === "changelog" ||
      route.id === "about",
  );

  return (
    <nav aria-label="サイト内" className="flex shrink-0 gap-1">
      {visibleRoutes.map((route) => {
        const isActive = route.id === activeId;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-sm no-underline transition-colors",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            key={route.id}
            to={route.id}
          >
            {route.navLabel}
          </Link>
        );
      })}
    </nav>
  );
}
