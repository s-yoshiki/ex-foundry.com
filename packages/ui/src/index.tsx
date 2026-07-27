import type { ComponentPropsWithoutRef, ReactNode } from "react";

type AppCardProps = ComponentPropsWithoutRef<"a"> & {
  description: string;
  host: string;
  name: string;
};

export function AppCard({ description, host, name, ...props }: AppCardProps) {
  return (
    <a className="app-card" {...props}>
      <span className="app-card__name">{name}</span>
      <span className="app-card__host">{host}</span>
      <span className="app-card__description">{description}</span>
      <span className="app-card__arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="page-shell">{children}</main>;
}
