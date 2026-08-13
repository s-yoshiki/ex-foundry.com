import path from "node:path";
import * as cheerio from "cheerio";
import type { Plugin } from "vite";
import {
  extractMdxTableOfContents,
  type Posts,
  PostsManager,
  prependTableOfContents,
  readMarkdownFile,
  renderMarkdown,
} from "../../../packages/blog-content/src/index";
import { POPULAR_POST_PATHS } from "../../../packages/blog-content/src/posts/popular-post-paths";
import type { BlogContentType } from "../src/features/blog/types/blog-post";

export const BLOG_CONTENT_MODULE = "virtual:ex-foundry-blog-content";
const RESOLVED_BLOG_CONTENT_MODULE = `\0${BLOG_CONTENT_MODULE}`;

export type BlogPostSummary = {
  id: string;
  title: string;
  path: string;
  date: string;
  publishedOn: string;
  coverImage: string;
  author: string;
  description: string;
  tags: readonly string[];
  aiGenerated: boolean;
  contentType: BlogContentType;
  contentPath: string;
  product: string;
  readingMinutes: number;
  toc: readonly { id: string; label: string }[];
};

export type BuiltBlogPost = BlogPostSummary & {
  html: string;
  toc: readonly { id: string; label: string }[];
};

const contentCache = new Map<string, Promise<readonly BuiltBlogPost[]>>();

function normalizeSource(source: string): string {
  return source.replace(/<CopyCharacterButton\s+codePoint="([0-9A-Fa-f]+)"\s*\/>/g, "`U+$1`");
}

/**
 * Older posts contain third-party scripts, ad widgets, and iframe embeds.
 * Article pages are static public documents, so those executable fragments
 * are deliberately removed during migration while ordinary prose, links,
 * tables, and images remain available.
 */
export function sanitizeBlogHtml(html: string): string {
  const document = cheerio.load(html, null, false);

  document("script, iframe, object, embed, form, input, button, style, link, noscript").remove();
  document("*").each((_index, element) => {
    if (!("attribs" in element)) return;

    for (const attribute of Object.keys(element.attribs)) {
      const normalized = attribute.toLowerCase();
      const value = element.attribs[attribute] ?? "";

      if (normalized.startsWith("on") || normalized === "srcdoc") {
        document(element).removeAttr(attribute);
      }

      if ((normalized === "href" || normalized === "src") && /^javascript:/i.test(value)) {
        document(element).removeAttr(attribute);
      }
    }
  });

  return document.root().html() ?? "";
}

function extractDescription(html: string, title: string): string {
  const document = cheerio.load(html, null, false);
  const paragraph = document("p").first().text().replace(/\s+/g, " ").trim();
  const value = paragraph || title;
  return value.length > 155 ? `${value.slice(0, 152).trimEnd()}…` : value;
}

function estimateReadingMinutes(html: string): number {
  const document = cheerio.load(html, null, false);
  const text = document.root().text().replace(/\s+/g, "");
  return Math.max(1, Math.ceil(text.length / 500));
}

function normalizeContentType(value: string | undefined): BlogContentType {
  if (value === "architecture" || value === "release" || value === "operations") {
    return value;
  }

  return "product";
}

function toSummary(post: Posts, html: string): BlogPostSummary {
  const id = post.path.split("/").pop() ?? "";
  const publishedOn = post.date.split(" ")[0] ?? post.date;

  return {
    aiGenerated: post.aiGenerated,
    author: post.author || "s-yoshiki",
    contentType: normalizeContentType(post.contentType),
    contentPath: `${post.path}/content.html`,
    coverImage: post.coverImage,
    date: post.date,
    description: extractDescription(html, post.title),
    id,
    path: post.path,
    publishedOn,
    product: post.product || "ex-foundry",
    readingMinutes: estimateReadingMinutes(html),
    tags: post.tags,
    title: post.title,
    toc: [],
  };
}

async function buildBlogContent(root: string): Promise<readonly BuiltBlogPost[]> {
  const postsDirectory = path.join(root, "content/posts");
  const manager = new PostsManager({
    basePath: "",
    postsDirectory,
    publicThumbnailDirectory: path.join(root, "public/images/thumbnail"),
  });

  const posts = await Promise.all(
    manager.getData().map(async (post) => {
      const source = normalizeSource(readMarkdownFile(post.filepath));
      const rendered = sanitizeBlogHtml(await renderMarkdown(source));
      const summary = toSummary(post, rendered);
      const toc = post.filepath.endsWith(".mdx")
        ? extractMdxTableOfContents(source)
        : prependTableOfContents(rendered).toc;

      return { ...summary, html: rendered, toc };
    }),
  );

  return posts;
}

export function loadBlogContent(root: string): Promise<readonly BuiltBlogPost[]> {
  const cached = contentCache.get(root);
  if (cached) return cached;

  const promise = buildBlogContent(root);
  contentCache.set(root, promise);
  return promise;
}

export function loadBlogSummaries(root: string): Promise<readonly BlogPostSummary[]> {
  return loadBlogContent(root).then((posts) => posts.map(({ html: _html, ...summary }) => summary));
}

/**
 * Provides `virtual:ex-foundry-blog-content` to the client bundle. Only
 * summaries are exposed — never `html` — so the initial JS payload stays
 * small; `ArticleContent` fetches an individual post's rendered body
 * on demand (see `plugins/static-routes.ts` for how that per-article file
 * is written, and `src/entry-server.tsx` for how the same body is embedded
 * directly into that article's pre-rendered static page).
 */
export function blogContent(): Plugin {
  return {
    name: "ex-foundry:blog-content",
    resolveId(id) {
      return id === BLOG_CONTENT_MODULE ? RESOLVED_BLOG_CONTENT_MODULE : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_BLOG_CONTENT_MODULE) return undefined;

      const posts = await loadBlogSummaries(process.cwd());
      return `export const BLOG_POSTS = ${JSON.stringify(posts)};
export const BLOG_POPULAR_POST_PATHS = ${JSON.stringify(POPULAR_POST_PATHS)};`;
    },
  };
}
