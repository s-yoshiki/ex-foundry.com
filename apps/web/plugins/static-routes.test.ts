import { describe, expect, it } from "vitest";
import type { RouteMeta } from "../src/routing/types";
import { escapeHtmlAttribute, replaceHeadTag, replaceTitle } from "./replace-head-tags";
import { outputFileName, renderRobots, renderRouteHtml, renderSitemap } from "./static-routes";

const INDEX_HTML = `<!doctype html>
<html lang="ja">
  <head>
    <title>Home</title>
    <meta name="description" content="home description" />
    <meta property="og:url" content="https://ex-foundry.com/" />
    <link rel="canonical" href="https://ex-foundry.com/" />
  </head>
  <body><div id="root"></div></body>
</html>`;

const aboutRoute: RouteMeta = {
  description: "about description",
  id: "about",
  navLabel: "About",
  path: "/about",
  title: "About page",
};

describe("outputFileName", () => {
  it("maps the root to index.html", () => {
    expect(outputFileName("/")).toBe("index.html");
  });

  it("maps a nested route to a directory index", () => {
    expect(outputFileName("/about")).toBe("about/index.html");
  });
});

describe("replaceTitle", () => {
  it("replaces the document title", () => {
    expect(replaceTitle(INDEX_HTML, "New")).toContain("<title>New</title>");
  });
});

describe("replaceHeadTag", () => {
  it("replaces only the identified tag", () => {
    const html = replaceHeadTag(INDEX_HTML, {
      content: "changed",
      matcher: 'name="description"',
      valueAttribute: "content",
    });

    expect(html).toContain('content="changed"');
    expect(html).toContain('<meta property="og:url" content="https://ex-foundry.com/" />');
  });

  it("leaves the document untouched when the tag is absent", () => {
    const html = replaceHeadTag(INDEX_HTML, {
      content: "changed",
      matcher: 'name="keywords"',
      valueAttribute: "content",
    });

    expect(html).toBe(INDEX_HTML);
  });
});

describe("escapeHtmlAttribute", () => {
  it("escapes characters that would break out of an attribute", () => {
    expect(escapeHtmlAttribute('a"b&c<d>')).toBe("a&quot;b&amp;c&lt;d&gt;");
  });
});

describe("renderRouteHtml", () => {
  it("rewrites title, description, and canonical for the route", () => {
    const html = renderRouteHtml(INDEX_HTML, aboutRoute);

    expect(html).toContain("<title>About page</title>");
    expect(html).toContain('content="about description"');
    expect(html).toContain('href="https://ex-foundry.com/about/"');
    expect(html).toContain('content="https://ex-foundry.com/about/"');
  });

  it("keeps the application mount point intact", () => {
    expect(renderRouteHtml(INDEX_HTML, aboutRoute)).toContain('<div id="root"></div>');
  });
});

describe("renderSitemap", () => {
  it("lists every route as an absolute URL", () => {
    const sitemap = renderSitemap([aboutRoute]);

    expect(sitemap).toContain("<loc>https://ex-foundry.com/about/</loc>");
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it("lists product pages ahead of articles", () => {
    const sitemap = renderSitemap(
      [aboutRoute],
      [
        {
          aiGenerated: false,
          author: "s-yoshiki",
          contentPath: "/entry/1101/content.html",
          contentType: "release",
          coverImage: "",
          date: "2026-08-11 10:00",
          description: "説明",
          id: "1101",
          path: "/entry/1101",
          product: "kusoge",
          publishedOn: "2026-08-11",
          readingMinutes: 2,
          tags: [],
          title: "タイトル",
          toc: [],
        },
      ],
      ["kusoge"],
    );

    expect(sitemap).toContain("<loc>https://ex-foundry.com/products/kusoge/</loc>");
    expect(sitemap).toContain("<loc>https://ex-foundry.com/entry/1101/</loc>");
  });
});

describe("renderRobots", () => {
  it("points crawlers at the sitemap", () => {
    expect(renderRobots()).toContain("Sitemap: https://ex-foundry.com/sitemap.xml");
  });
});
