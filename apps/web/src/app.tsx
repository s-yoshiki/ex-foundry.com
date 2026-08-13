import type { ReactNode } from "react";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { usePageViewTracking } from "./hooks/use-page-view-tracking";

/**
 * Application shell shared by every route.
 *
 * Router-agnostic: the active page arrives as `children`, so the adapter
 * decides how it is resolved (React Router renders it through an `Outlet`).
 */
export function App({ children }: { children: ReactNode }) {
  usePageViewTracking();

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        href="#main"
      >
        本文へスキップ
      </a>

      <div className="min-h-screen bg-background">
        <SiteHeader />

        <main id="main">{children}</main>

        <SiteFooter />
      </div>
    </>
  );
}
