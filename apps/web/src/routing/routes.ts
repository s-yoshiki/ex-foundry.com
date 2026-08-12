import type { RouteId, RouteMeta } from "./types";

export const SITE_URL = "https://ex-foundry.com";
export const SITE_NAME = "EX FOUNDRY";

/**
 * The single source of truth for the site's routes.
 *
 * Consumed by the router adapter at runtime and by the Vite plugin at build
 * time (static HTML, sitemap, structured data). It therefore holds data only —
 * components are mapped separately in `route-components.tsx`.
 */
export const ROUTES = [
  {
    description:
      "ex-foundry.comで公開しているWebアプリケーションの一覧です。開発ツール、ジェネレーター、データ可視化をブラウザだけで利用できます。",
    id: "home",
    navLabel: "アプリ一覧",
    path: "/",
    title: "EX FOUNDRY - 公開中のWebアプリケーション一覧",
  },
  {
    description: "EX FOUNDRYの目的、運用方針、このサイトを構成している技術スタックを紹介します。",
    id: "about",
    navLabel: "このサイトについて",
    path: "/about",
    title: "EX FOUNDRYについて - EX FOUNDRY",
  },
  {
    description:
      "EX FOUNDRYのアプリケーション開発、設計、運用で得た知見を再現できる形で記録した技術記事の一覧です。",
    id: "articles",
    navLabel: "技術記事",
    path: "/articles",
    title: "技術記事 - EX FOUNDRY",
  },
  {
    description:
      "EX FOUNDRYのプライバシーポリシー。Google AnalyticsとGoogle AdSenseによる情報の取り扱いを説明します。",
    id: "privacy",
    navLabel: "プライバシー",
    path: "/privacy",
    title: "プライバシーポリシー - EX FOUNDRY",
  },
] as const satisfies readonly RouteMeta[];

export function findRoute(id: RouteId): RouteMeta {
  const route = ROUTES.find((candidate) => candidate.id === id);

  if (route === undefined) {
    throw new Error(`Unknown route id: ${id}`);
  }

  return route;
}

export function routePath(id: RouteId): string {
  return findRoute(id).path;
}

/** Matches a pathname to a route, tolerating a trailing slash. */
export function matchRoute(pathname: string): RouteMeta | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  return ROUTES.find((route) => route.path === normalized);
}

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}
