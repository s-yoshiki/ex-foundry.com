import type { Plugin } from "vite";
import { getApplications } from "../src/features/app-directory/functions/get-applications";
import {
  BLOG_CONTENT_TYPE_LABELS,
  getBlogProductLabel,
} from "../src/features/blog/types/blog-post";
import { canonicalUrl, ROUTES, SITE_NAME, SITE_URL } from "../src/routing/routes";
import { type BuiltBlogPost, loadBlogContent } from "./blog-content";

function buildStructuredData(posts: readonly BuiltBlogPost[]): string {
  const applications = getApplications();
  const summaries = posts.map(({ html: _html, ...summary }) => summary);

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
      {
        "@type": "Blog",
        description:
          "EX FOUNDRYで提供しているプロダクトの目的、技術構成、リリース情報、運用上の判断。",
        inLanguage: "ja",
        name: "EX FOUNDRY プロダクト情報",
        url: `${SITE_URL}/articles/`,
      },
      {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListUnordered",
        name: "EX FOUNDRYのプロダクト情報",
        numberOfItems: summaries.length,
        itemListElement: summaries.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Article",
            about: {
              "@type": "Thing",
              name: getBlogProductLabel(post.product),
            },
            articleSection: BLOG_CONTENT_TYPE_LABELS[post.contentType],
            datePublished: post.publishedOn,
            description: post.description,
            headline: post.title,
            inLanguage: "ja",
            url: `${SITE_URL}${post.path}/`,
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
    async transformIndexHtml() {
      const posts = await loadBlogContent(process.cwd());

      return [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: buildStructuredData(posts),
          injectTo: "head" as const,
        },
      ];
    },
  };
}
