import type { Plugin } from "vite";
import { getApplications } from "../src/features/app-directory/functions/get-applications";
import { canonicalUrl, ROUTES, SITE_NAME, SITE_URL } from "../src/routing/routes";

function buildStructuredData(): string {
  const applications = getApplications();

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        inLanguage: "ja",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
      {
        "@type": "SiteNavigationElement",
        name: ROUTES.map((route) => route.navLabel),
        url: ROUTES.map((route) => canonicalUrl(route.path)),
      },
      {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListUnordered",
        name: `${SITE_NAME}で公開しているWebアプリケーション`,
        numberOfItems: applications.length,
        itemListElement: applications.map((application, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebApplication",
            applicationCategory: "UtilitiesApplication",
            browserRequirements: "Requires JavaScript",
            description: application.description,
            inLanguage: "ja",
            name: application.name,
            operatingSystem: "Any",
            url: `https://${application.host}/`,
          },
        })),
      },
    ],
  });
}

/**
 * Injects schema.org JSON-LD into `index.html` at build time so that it is
 * present in the served HTML rather than added after hydration.
 */
export function structuredData(): Plugin {
  return {
    name: "ex-foundry:structured-data",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: buildStructuredData(),
          injectTo: "head",
        },
      ];
    },
  };
}
