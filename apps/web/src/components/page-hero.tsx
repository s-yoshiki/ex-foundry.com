import { cn } from "@repo/ui";
import type { ReactNode } from "react";

type PageHeroProps = {
  action?: ReactNode;
  bordered?: boolean;
  className?: string;
  description?: ReactNode;
  eyebrow: string;
  title: string;
  titleId?: string;
};

/**
 * Standard page header: eyebrow label, h1, and an optional lead paragraph.
 * Shared by every top-level page so heading scale and spacing stay in sync.
 */
export function PageHero({
  action,
  bordered = false,
  className,
  description,
  eyebrow,
  title,
  titleId,
}: PageHeroProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        bordered && "border-b pb-8",
        className,
      )}
    >
      <div>
        <p className="mb-2 font-mono text-xs tracking-[0.12em] text-primary uppercase">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl" id={titleId}>
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="w-full lg:w-auto">{action}</div> : null}
    </div>
  );
}
