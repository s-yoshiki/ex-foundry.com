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
      "EX FOUNDRYのプロダクト紹介、技術構成、リリース情報、運用上の判断を公開しています。",
    id: "home",
    navLabel: "プロダクト情報",
    path: "/",
    title: "EX FOUNDRY - プロダクト情報と開発記録",
  },
  {
    description:
      "ex-foundry.comで公開しているWebアプリケーションの一覧です。開発ツール、ジェネレーター、データ可視化をブラウザだけで利用できます。",
    id: "apps",
    navLabel: "アプリ一覧",
    path: "/apps",
    title: "公開中のWebアプリケーション - EX FOUNDRY",
  },
  {
    description: "EX FOUNDRYの目的、運用方針、このサイトを構成している技術スタックを紹介します。",
    id: "about",
    navLabel: "このサイトについて",
    path: "/about",
    title: "EX FOUNDRYについて - EX FOUNDRY",
  },
  {
    description: "EX FOUNDRYの記事の作成、検証、更新、生成AIの利用に関する編集方針を説明します。",
    id: "editorialPolicy",
    navLabel: "編集方針",
    path: "/editorial-policy",
    title: "編集方針 - EX FOUNDRY",
  },
  {
    description: "EX FOUNDRYの記事や公開中のWebアプリケーションに関するお問い合わせ窓口です。",
    id: "contact",
    navLabel: "お問い合わせ",
    path: "/contact",
    title: "お問い合わせ - EX FOUNDRY",
  },
  {
    description:
      "EX FOUNDRYで提供しているプロダクトの紹介、技術構成、リリース、運用情報をまとめています。",
    id: "articles",
    navLabel: "プロダクト情報",
    path: "/articles",
    title: "プロダクト情報 - EX FOUNDRY",
  },
  {
    description:
      "EX FOUNDRYで公開している各プロダクトのリリース履歴を、日付順にまとめて確認できます。",
    id: "changelog",
    navLabel: "更新履歴",
    path: "/changelog",
    title: "更新履歴 - EX FOUNDRY",
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
  return canonicalPath(findRoute(id).path);
}

/** Static hosting serves non-root pages from `<path>/index.html`. */
function canonicalPath(path: string): string {
  if (path === "/") {
    return "/";
  }

  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

/** Matches a pathname to a route, tolerating a trailing slash. */
export function matchRoute(pathname: string): RouteMeta | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  return ROUTES.find((route) => route.path === normalized);
}

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${canonicalPath(path)}`;
}
