import type { ComponentType } from "react";
import { AboutPage } from "../pages/about-page";
import { AppsPage } from "../pages/apps-page";
import { ArticlesPage } from "../pages/articles-page";
import { ContactPage } from "../pages/contact-page";
import { EditorialPolicyPage } from "../pages/editorial-policy-page";
import { HomePage } from "../pages/home-page";
import { PrivacyPage } from "../pages/privacy-page";
import type { RouteId } from "./types";

/**
 * Maps each route in the manifest to its page component.
 *
 * Kept apart from `routes.ts` so the manifest stays importable from Node during
 * the build. Adding a `RouteId` without a component is a type error.
 */
export const ROUTE_COMPONENTS: Record<RouteId, ComponentType> = {
  articles: ArticlesPage,
  about: AboutPage,
  apps: AppsPage,
  contact: ContactPage,
  editorialPolicy: EditorialPolicyPage,
  home: HomePage,
  privacy: PrivacyPage,
};
