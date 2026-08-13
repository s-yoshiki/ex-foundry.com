import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createServer, type Plugin } from "vite";
import { getAllPostAssets } from "../../../packages/blog-content/src/index";
import { getApplications } from "../src/features/app-directory/functions/get-applications";
import { canonicalUrl, ROUTES, SITE_URL } from "../src/routing/routes";
import type { RouteMeta } from "../src/routing/types";
import { type BlogPostSummary, type BuiltBlogPost, loadBlogContent } from "./blog-content";
import { replaceHeadTag, replaceTitle } from "./replace-head-tags";

type RenderRoute = (path: string, options?: { articleHtml?: string }) => string;

/** `/about` -> `about/index.html`, so a static host can serve it directly. */
export function outputFileName(path: string): string {
  return path === "/" ? "index.html" : `${path.replace(/^\//, "")}/index.html`;
}

export function renderRouteHtml(
  indexHtml: string,
  route: Pick<RouteMeta, "description" | "path" | "title">,
): string {
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

function replaceRootContent(indexHtml: string, content: string): string {
  return indexHtml.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

function summariesFrom(posts: readonly BuiltBlogPost[]): readonly BlogPostSummary[] {
  return posts.map(({ html: _html, ...summary }) => summary);
}

export function renderSitemap(
  routes: readonly RouteMeta[],
  posts: readonly BlogPostSummary[] = [],
  productSlugs: readonly string[] = [],
): string {
  const entries = [
    ...routes.map((route) => ({
      path: route.path,
      priority: route.path === "/" ? "1.0" : "0.7",
    })),
    ...productSlugs.map((slug) => ({ path: `/products/${slug}/`, priority: "0.8" })),
    ...posts.map((post) => ({ path: `${post.path}/`, priority: "0.6" })),
  ]
    .map(
      (entry) =>
        `  <url>\n    <loc>${canonicalUrl(entry.path)}</loc>\n` +
        "    <changefreq>weekly</changefreq>\n" +
        `    <priority>${entry.priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function renderRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

/**
 * Emits static HTML for the manifest routes, every imported article, and
 * every product page.
 *
 * The page body is produced by rendering the real `<App>` component tree
 * through `react-dom/server` (see `src/entry-server.tsx`) inside a Vite dev
 * server running in middleware mode. That server is only used for its module
 * graph — `ssrLoadModule` — so JSX, the `virtual:ex-foundry-blog-content`
 * module, and workspace packages like `@repo/ui` all resolve exactly as they
 * do for the client bundle, and the crawler-facing HTML can never drift from
 * what the browser renders. The article body is also written to a small
 * per-article file so client-side navigation does not put all migrated
 * content into the initial JS bundle.
 */
export function staticRoutes(): Plugin {
  let outDir = "dist";
  let root = process.cwd();

  return {
    name: "ex-foundry:static-routes",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = join(config.root, config.build.outDir);
    },
    async writeBundle(_options, bundle) {
      const index = bundle["index.html"];

      if (index === undefined || index.type !== "asset") {
        this.error("index.html was not produced by the build.");
        return;
      }

      const indexHtml = String(index.source);
      const posts = await loadBlogContent(root);
      const applications = getApplications();
      const summaries = summariesFrom(posts);

      const ssrServer = await createServer({
        root,
        server: { middlewareMode: true },
        appType: "custom",
      });

      try {
        const entryServerModule = await ssrServer.ssrLoadModule("/src/entry-server.tsx");
        const renderRoute = entryServerModule.renderRoute as RenderRoute;

        await Promise.all(
          ROUTES.map(async (route) => {
            const target = join(outDir, outputFileName(route.path));
            const routeHtml = renderRouteHtml(indexHtml, route);

            await mkdir(dirname(target), { recursive: true });
            await writeFile(target, replaceRootContent(routeHtml, renderRoute(route.path)), "utf8");
          }),
        );

        await Promise.all(
          posts.map(async (post) => {
            const articleIndex = join(outDir, outputFileName(post.path));
            const contentFile = join(outDir, post.contentPath.replace(/^\//, ""));
            const articleHtml = renderRouteHtml(indexHtml, {
              description: post.description,
              path: `${post.path}/`,
              title: `${post.title} - EX FOUNDRY`,
            });

            await mkdir(dirname(articleIndex), { recursive: true });
            await writeFile(
              articleIndex,
              replaceRootContent(articleHtml, renderRoute(post.path, { articleHtml: post.html })),
              "utf8",
            );
            await mkdir(dirname(contentFile), { recursive: true });
            await writeFile(contentFile, post.html, "utf8");
          }),
        );

        await Promise.all(
          applications.map(async (application) => {
            const productPath = `/products/${application.slug}`;
            const productIndex = join(outDir, outputFileName(productPath));
            const productHtml = renderRouteHtml(indexHtml, {
              description: application.description,
              path: `${productPath}/`,
              title: `${application.name} - EX FOUNDRY`,
            });

            await mkdir(dirname(productIndex), { recursive: true });
            await writeFile(
              productIndex,
              replaceRootContent(productHtml, renderRoute(productPath)),
              "utf8",
            );
          }),
        );
      } finally {
        await ssrServer.close();
      }

      await Promise.all(
        getAllPostAssets(join(root, "content/posts")).map(async (asset) => {
          const target = join(outDir, `entry/${asset.id}`, asset.asset);

          await mkdir(dirname(target), { recursive: true });
          await copyFile(asset.filepath, target);
        }),
      );

      await writeFile(
        join(outDir, "sitemap.xml"),
        renderSitemap(
          ROUTES,
          summaries,
          applications.map((application) => application.slug),
        ),
        "utf8",
      );
      await writeFile(join(outDir, "robots.txt"), renderRobots(), "utf8");
    },
  };
}
