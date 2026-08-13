import { describe, expect, it } from "vitest";
import type { RouteMeta } from "../src/routing/types";
import {
  renderArticleIndex,
  renderStaticContact,
  renderStaticEditorialPolicy,
} from "./blog-content";
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
    expect(html).toContain('href="https://ex-foundry.com/about"');
    expect(html).toContain('content="https://ex-foundry.com/about"');
  });

  it("keeps the application mount point intact", () => {
    expect(renderRouteHtml(INDEX_HTML, aboutRoute)).toContain('<div id="root"></div>');
  });
});

describe("renderSitemap", () => {
  it("lists every route as an absolute URL", () => {
    const sitemap = renderSitemap([aboutRoute]);

    expect(sitemap).toContain("<loc>https://ex-foundry.com/about</loc>");
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});

describe("renderRobots", () => {
  it("points crawlers at the sitemap", () => {
    expect(renderRobots()).toContain("Sitemap: https://ex-foundry.com/sitemap.xml");
  });
});

describe("editorial guidance pages", () => {
  it("renders the contact page as static HTML", () => {
    const html = renderStaticContact();

    expect(html).toContain("お問い合わせ");
    expect(html).toContain("GitHub Issuesで記事を知らせる");
  });

  it("renders the editorial policy as static HTML", () => {
    const html = renderStaticEditorialPolicy();

    expect(html).toContain("編集方針");
    expect(html).toContain("記事を公開するまで");
    expect(html).toContain("生成AIの利用");
  });
});

describe("product information index", () => {
  it("renders article type and product filters", () => {
    const html = renderArticleIndex([
      {
        aiGenerated: true,
        author: "s-yoshiki",
        contentPath: "/entry/1001/content.html",
        contentType: "product",
        coverImage: "",
        date: "2026-08-13 10:00",
        description: "プロダクトの説明",
        id: "1001",
        path: "/entry/1001",
        product: "ex-foundry",
        publishedOn: "2026-08-13",
        readingMinutes: 2,
        tags: ["EX FOUNDRY"],
        title: "プロダクト紹介",
        toc: [],
      },
      {
        aiGenerated: false,
        author: "s-yoshiki",
        contentPath: "/entry/1102/content.html",
        contentType: "architecture",
        coverImage: "",
        date: "2026-08-11 10:00",
        description: "技術構成の説明",
        id: "1102",
        path: "/entry/1102",
        product: "devtoys",
        publishedOn: "2026-08-11",
        readingMinutes: 3,
        tags: ["DevToys Web"],
        title: "技術構成",
        toc: [],
      },
    ]);

    expect(html).toContain("プロダクト 1");
    expect(html).toContain("技術構成 1");
    expect(html).toContain("EX FOUNDRY");
    expect(html).toContain("DevToys Web");
  });
});
