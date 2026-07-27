import { cn } from "@ex-foundry/ui/lib/utils";
import type { ReactNode } from "react";

/**
 * Centred page container. Landmarks (`header`, `main`, `footer`) are the
 * caller's responsibility so that each app can decide its own document outline.
 */
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[880px] px-5 pt-10 pb-10 sm:pt-18", className)}>
      {children}
    </div>
  );
}
