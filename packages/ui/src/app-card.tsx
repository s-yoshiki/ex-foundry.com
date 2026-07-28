import { Badge } from "@repo/ui/components/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type AppCardProps = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  badge?: ReactNode;
  description: string;
  host: string;
  name: string;
  tags?: readonly string[];
};

/**
 * Link card for an external application. Purely presentational: the caller
 * supplies the already-formatted label, badge, and tags.
 */
export function AppCard({
  badge,
  className,
  description,
  host,
  name,
  tags = [],
  ...props
}: AppCardProps) {
  return (
    <a
      className={cn(
        "group relative flex flex-col gap-2 rounded-xl border bg-card p-6 pr-14",
        "text-card-foreground no-underline shadow-xs transition-[border-color,transform]",
        "hover:-translate-y-0.5 hover:border-primary",
        className,
      )}
      {...props}
    >
      <span className="flex flex-wrap items-center gap-2.5">
        <span className="text-lg font-bold tracking-tight">{name}</span>
        {badge}
      </span>

      <span className="font-mono text-xs text-primary">{host}</span>

      <span className="leading-relaxed text-muted-foreground">{description}</span>

      {tags.length > 0 && (
        <span className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge className="font-mono text-muted-foreground" key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </span>
      )}

      <ArrowUpRight
        aria-hidden="true"
        className="absolute top-6 right-6 size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
