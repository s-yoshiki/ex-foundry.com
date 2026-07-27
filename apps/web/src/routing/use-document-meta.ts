import { useEffect } from "react";
import { canonicalUrl } from "./routes";
import type { RouteMeta } from "./types";

function setMeta(selector: string, attribute: string, value: string): void {
  const element = document.head.querySelector(selector);

  element?.setAttribute(attribute, value);
}

/** Sets only the document title, for views that are not part of the manifest. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

/**
 * Keeps the document head in sync with the active route.
 *
 * The build emits correct static HTML per route, so this only matters for
 * client-side navigation. Kept router-agnostic on purpose: neither React Router
 * nor TanStack Router owns the page metadata.
 */
export function useDocumentMeta(route: RouteMeta): void {
  useEffect(() => {
    document.title = route.title;
    setMeta('meta[name="description"]', "content", route.description);
    setMeta('meta[property="og:title"]', "content", route.title);
    setMeta('meta[property="og:description"]', "content", route.description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl(route.path));
    setMeta('meta[name="twitter:title"]', "content", route.title);
    setMeta('meta[name="twitter:description"]', "content", route.description);
    setMeta('link[rel="canonical"]', "href", canonicalUrl(route.path));
  }, [route]);
}
