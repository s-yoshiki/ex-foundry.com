import type { GtagFunction } from "./gtag";

export type PageView = {
  pageLocation: string;
  pageTitle: string;
};

/**
 * Sends a GA4 `page_view` event for a client-side navigation.
 *
 * `gtag` is injected so this stays testable without a real `window.gtag`, and
 * a missing function (blocked by an ad blocker, or not loaded yet) is a no-op
 * rather than a thrown error.
 */
export function trackPageView(gtag: GtagFunction | undefined, page: PageView): void {
  if (typeof gtag !== "function") {
    return;
  }

  gtag("event", "page_view", {
    page_location: page.pageLocation,
    page_title: page.pageTitle,
  });
}
