import { cn } from "@ex-foundry/ui";
import { Link } from "../routing/link";
import { useNavigation } from "../routing/navigation-context";
import { matchRoute, ROUTES } from "../routing/routes";

export function SiteNav() {
  const { location } = useNavigation();
  const active = matchRoute(location.pathname);

  return (
    <nav aria-label="サイト内" className="flex gap-1">
      {ROUTES.map((route) => {
        const isActive = route.id === active?.id;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm no-underline transition-colors",
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
