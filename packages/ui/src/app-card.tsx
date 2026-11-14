import { Badge } from "@repo/ui/components/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type AppCardProps = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  badge?: ReactNode;
  description: string;
  host: string;
  /** Small icon tile giving the card a visual anchor besides its name. */
  mark?: ReactNode;
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
  mark,
  name,
  tags = [],
  ...props
}: AppCardProps) {
  return (
    <a
      className={cn(
        "group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5",
        "text-card-foreground no-underline shadow-xs transition-[border-color,box-shadow,transform]",
        "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-3">
        {mark ? (
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
          >
            {mark}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="text-base font-semibold tracking-tight sm:text-lg">{name}</span>
          {badge}
        </span>
      </span>

      <span className="text-sm leading-6 text-muted-foreground">{description}</span>

      {tags.length > 0 && (
        <span className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge className="font-mono text-muted-foreground" key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </span>
      )}

      <span className="mt-auto flex items-center justify-between gap-3 border-t pt-3 text-xs">
        <span className="truncate font-mono text-muted-foreground">{host}</span>
        <span className="flex shrink-0 items-center gap-1 font-medium text-primary">
          詳細を見る
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </span>
    </a>
  );
}
