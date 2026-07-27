import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Plugin } from "vite";
import { canonicalUrl, ROUTES, SITE_URL } from "../src/routing/routes";
import type { RouteMeta } from "../src/routing/types";
import { replaceHeadTag, replaceTitle } from "./replace-head-tags";

/** `/about` -> `about/index.html`, so a static host can serve it directly. */
export function outputFileName(path: string): string {
  return path === "/" ? "index.html" : `${path.replace(/^\//, "")}/index.html`;
}

export function renderRouteHtml(indexHtml: string, route: RouteMeta): string {
  const url = canonicalUrl(route.path);
  let html = replaceTitle(indexHtml, route.title);

  for (const [matcher, valueAttribute, content] of [
    ['name="description"', "content", route.description],
    ['property="og:title"', "content", route.title],
    ['property="og:description"', "content", route.description],
    ['property="og:url"', "content", url],
    ['name="twitter:title"', "content", route.title],
    ['name="twitter:description"', "content", route.description],
    ['rel="canonical"', "href", url],
  ] as const) {
    html = replaceHeadTag(html, { content, matcher, valueAttribute });
  }

  return html;
}

export function renderSitemap(routes: readonly RouteMeta[]): string {
  const entries = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${canonicalUrl(route.path)}</loc>\n` +
        "    <changefreq>weekly</changefreq>\n" +
        `    <priority>${route.path === "/" ? "1.0" : "0.7"}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function renderRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

/**
 * Emits one static HTML file per route, plus sitemap.xml and robots.txt.
 *
 * GitHub Pages has no SPA fallback, so `/about` must exist as a real file for a
 * direct visit or a crawler to reach it. Generating from the route manifest also
 * gives every route its own title, description, and canonical URL in the served
 * HTML — the client router only has to keep them in sync after that.
 *
 * Vite adds `index.html` to the bundle after `generateBundle`, so the work
 * happens in `writeBundle` and writes to disk directly.
 */
export function staticRoutes(): Plugin {
  let outDir = "dist";

  return {
    name: "ex-foundry:static-routes",
    apply: "build",
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
    },
    async writeBundle(_options, bundle) {
      const index = bundle["index.html"];

      if (index === undefined || index.type !== "asset") {
        this.error("index.html was not produced by the build.");

        return;
      }

      const indexHtml = String(index.source);

      await Promise.all(
        ROUTES.map(async (route) => {
          const target = join(outDir, outputFileName(route.path));

          await mkdir(dirname(target), { recursive: true });
          await writeFile(target, renderRouteHtml(indexHtml, route), "utf8");
        }),
      );

      await writeFile(join(outDir, "sitemap.xml"), renderSitemap(ROUTES), "utf8");
      await writeFile(join(outDir, "robots.txt"), renderRobots(), "utf8");
    },
  };
}
