import type { ComponentType } from "react";
import { AboutPage } from "../pages/about-page";
import { HomePage } from "../pages/home-page";
import type { RouteId } from "./types";

/**
 * Maps each route in the manifest to its page component.
 *
 * Kept apart from `routes.ts` so the manifest stays importable from Node during
 * the build. Adding a `RouteId` without a component is a type error.
 */
export const ROUTE_COMPONENTS: Record<RouteId, ComponentType> = {
  about: AboutPage,
  home: HomePage,
};
