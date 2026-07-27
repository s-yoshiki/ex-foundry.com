import { useEffect } from "react";
import { trackPageView } from "../libs/analytics/track-page-view";
import { useNavigation } from "../routing/navigation-context";

/**
 * Fires a GA4 page_view on every client-side navigation.
 *
 * The initial load is skipped here: `index.html` configures `gtag` with
 * `send_page_view: false`, so this hook is the only source of page_view
 * events, and it must run after the new page has set `document.title` (see
 * `useDocumentMeta`). Mounting this once in the app shell — rather than per
 * page — keeps every route, including future ones, tracked without change.
 */
export function usePageViewTracking(): void {
  const { location } = useNavigation();

  useEffect(() => {
    trackPageView(window.gtag, {
      pageLocation: `${window.location.origin}${location.pathname}${location.search}`,
      pageTitle: document.title,
    });
  }, [location.pathname, location.search]);
}
