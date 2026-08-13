import { createBrowserRouter, Outlet, type RouteObject } from "react-router";
import { App } from "../../../app";
import { ArticlePage } from "../../../features/blog/components/article-page";
import { NotFoundPage } from "../../../pages/not-found-page";
import { ProductPage } from "../../../pages/product-page";
import { ROUTE_COMPONENTS } from "../../route-components";
import { ROUTES } from "../../routes";
import { ReactRouterNavigationProvider } from "./navigation-provider";

function Layout() {
  return (
    <ReactRouterNavigationProvider>
      <App>
        <Outlet />
      </App>
    </ReactRouterNavigationProvider>
  );
}

/** Builds React Router's route tree from the framework-neutral manifest. */
export function createAppRouter() {
  const children: RouteObject[] = ROUTES.map((route) => ({
    Component: ROUTE_COMPONENTS[route.id],
    index: route.path === "/",
    path: route.path === "/" ? undefined : route.path,
  }));

  return createBrowserRouter([
    {
      Component: Layout,
      children: [
        ...children,
        { Component: ArticlePage, path: "entry/:id" },
        { Component: ProductPage, path: "products/:slug" },
        { Component: NotFoundPage, path: "*" },
      ],
      path: "/",
    },
  ]);
}
