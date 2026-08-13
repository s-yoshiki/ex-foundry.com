import { renderToStaticMarkup } from "react-dom/server";
import { App } from "./app";
import { ArticlePage } from "./features/blog/components/article-page";
import { getBlogPostId } from "./features/blog/functions/get-blog-posts";
import { getProductSlug } from "./features/product-detail/functions/get-product";
import { NotFoundPage } from "./pages/not-found-page";
import { ProductPage } from "./pages/product-page";
import { MemoryNavigationProvider } from "./routing/adapters/memory/memory-navigation";
import { ROUTE_COMPONENTS } from "./routing/route-components";
import { matchRoute } from "./routing/routes";

/**
 * Picks the page component for a build-time route the same way the router
 * would at runtime — manifest routes through `ROUTE_COMPONENTS`, `/entry/:id`
 * and `/products/:slug` through their own pattern, matching
 * `create-app-router.tsx`.
 */
function RouteContent({ articleHtml, path }: { articleHtml?: string; path: string }) {
  const route = matchRoute(path);
  if (route) {
    const Component = ROUTE_COMPONENTS[route.id];
    return <Component />;
  }

  if (getBlogPostId(path) !== undefined) {
    return <ArticlePage presetHtml={articleHtml} />;
  }

  if (getProductSlug(path) !== undefined) {
    return <ProductPage />;
  }

  return <NotFoundPage />;
}

/**
 * Renders one route's full page — header, nav, and footer included — to a
 * static HTML string. Used only at build time (see `plugins/static-routes.ts`)
 * to pre-render `dist/**\/index.html` for crawlers and no-JS visitors; the
 * live app never calls this and instead mounts fresh via `main.tsx`.
 */
export function renderRoute(path: string, options: { articleHtml?: string } = {}): string {
  return renderToStaticMarkup(
    <MemoryNavigationProvider initialUrl={path}>
      <App>
        <RouteContent articleHtml={options.articleHtml} path={path} />
      </App>
    </MemoryNavigationProvider>,
  );
}
