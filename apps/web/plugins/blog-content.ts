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
import type { Application } from "../src/features/app-directory/types/application";
import { BLOG_CONTENT_CLASS } from "../src/features/blog/functions/blog-content-style";

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
  contentPath: string;
};

export type BuiltBlogPost = BlogPostSummary & {
  html: string;
  toc: readonly { id: string; label: string }[];
};

const contentCache = new Map<string, Promise<readonly BuiltBlogPost[]>>();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

function toSummary(post: Posts, html: string): BlogPostSummary {
  const id = post.path.split("/").pop() ?? "";
  const publishedOn = post.date.split(" ")[0] ?? post.date;

  return {
    aiGenerated: post.aiGenerated,
    author: post.author || "s-yoshiki",
    contentPath: `${post.path}/content.html`,
    coverImage: post.coverImage,
    date: post.date,
    description: extractDescription(html, post.title),
    id,
    path: post.path,
    publishedOn,
    tags: post.tags,
    title: post.title,
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
  return loadBlogContent(root).then((posts) =>
    posts.map(({ html: _html, toc: _toc, ...summary }) => summary),
  );
}

export function renderArticleContent(post: BuiltBlogPost): string {
  const tags = post.tags
    .map((tag) => `<li class="rounded-full border px-2.5 py-1 text-xs">${escapeHtml(tag)}</li>`)
    .join("");

  return `<article class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
  <nav aria-label="パンくずリスト" class="mb-8 text-sm text-muted-foreground"><a href="/">EX FOUNDRY</a> / <a href="/articles/">記事</a> / <span>${escapeHtml(post.title)}</span></nav>
  <header class="mb-10 border-b pb-8">
    <p class="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">TECHNICAL NOTE</p>
    <h1 class="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">${escapeHtml(post.title)}</h1>
    <p class="mt-4 text-sm text-muted-foreground"><time datetime="${escapeHtml(post.publishedOn)}">${escapeHtml(post.publishedOn)}</time> · ${escapeHtml(post.author)}</p>
    <ul class="mt-5 flex flex-wrap gap-2" aria-label="タグ">${tags}</ul>
  </header>
  <div class="${BLOG_CONTENT_CLASS} max-w-none">${post.html}</div>
  <footer class="mt-12 border-t pt-6 text-sm text-muted-foreground"><a href="/articles/">記事一覧へ戻る</a></footer>
</article>`;
}

export function renderArticleIndex(posts: readonly BlogPostSummary[]): string {
  const items = posts
    .map(
      (post) => `<li class="rounded-xl border p-5">
  <p class="font-mono text-xs text-muted-foreground">${escapeHtml(post.publishedOn)}</p>
  <h2 class="mt-2 text-xl font-semibold"><a href="${escapeHtml(`${post.path}/`)}">${escapeHtml(post.title)}</a></h2>
  <p class="mt-3 leading-relaxed text-muted-foreground">${escapeHtml(post.description)}</p>
  <ul class="mt-4 flex flex-wrap gap-2" aria-label="タグ">${post.tags
    .slice(0, 5)
    .map(
      (tag) => `<li class="rounded-full bg-secondary px-2.5 py-1 text-xs">${escapeHtml(tag)}</li>`,
    )
    .join("")}</ul>
</li>`,
    )
    .join("");

  return `<section aria-labelledby="articles-heading" class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
  <p class="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">KNOWLEDGE BASE</p>
  <h1 id="articles-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">技術記事</h1>
  <p class="mt-5 max-w-2xl leading-relaxed text-muted-foreground">EX FOUNDRYのアプリケーション開発、設計、運用で得た知見を、再現できる形で記録しています。</p>
  <p class="mt-6 text-sm text-muted-foreground">${posts.length}件の記事</p>
  <ul class="mt-6 grid list-none gap-4 p-0 md:grid-cols-2">${items}</ul>
</section>`;
}

export function renderStaticHome(
  posts: readonly BlogPostSummary[],
  applications: readonly Application[],
): string {
  const applicationsHtml = applications
    .map(
      (application) => `<li class="rounded-xl border p-5">
  <h2 class="text-xl font-semibold"><a href="https://${escapeHtml(application.host)}/">${escapeHtml(application.name)}</a></h2>
  <p class="mt-3 leading-relaxed text-muted-foreground">${escapeHtml(application.description)}</p>
  <p class="mt-3 text-xs text-muted-foreground">${escapeHtml(application.stack.join(" · "))}</p>
</li>`,
    )
    .join("");
  const latest = posts
    .slice(0, 6)
    .map(
      (post) =>
        `<li><a href="${escapeHtml(`${post.path}/`)}" class="font-semibold">${escapeHtml(post.title)}</a><span class="ml-3 text-xs text-muted-foreground">${escapeHtml(post.publishedOn)}</span></li>`,
    )
    .join("");

  return `<section aria-labelledby="home-heading" class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
  <h1 id="home-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">EX FOUNDRY</h1>
  <p class="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">個人開発したWebアプリケーションと、そこから得た設計・実装・運用の知見を公開しています。</p>
  <p class="mt-6"><a href="/articles/" class="font-semibold">技術記事を読む（${posts.length}件）</a></p>
  <section aria-labelledby="applications-heading" class="mt-12">
    <h2 id="applications-heading" class="text-xl font-semibold">公開中のWebアプリケーション</h2>
    <ul class="mt-4 grid list-none gap-4 p-0 md:grid-cols-2">${applicationsHtml}</ul>
  </section>
  <section aria-labelledby="latest-articles-heading" class="mt-12">
    <h2 id="latest-articles-heading" class="text-xl font-semibold">最近の記事</h2>
    <ul class="mt-4 grid list-none gap-3 p-0">${latest}</ul>
  </section>
</section>`;
}

export function renderStaticAbout(): string {
  return `<section aria-labelledby="about-heading" class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
  <h1 id="about-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">EX FOUNDRYについて</h1>
  <div class="blog-content mt-8 max-w-2xl">
    <p>EX FOUNDRYは、日々の作業で欲しくなった小さなWebアプリケーションを作って公開している個人プロジェクトです。</p>
    <p>アプリケーション本体だけでなく、設計上の判断、実装の過程、運用で得た知見も技術記事として記録しています。</p>
    <p>ソースコードはGitHubで公開し、GitHub ActionsとGitHub Pagesを使って静的サイトとして配信しています。</p>
  </div>
</section>`;
}

export function renderStaticPrivacy(): string {
  return `<article class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
  <h1 class="text-3xl font-bold tracking-tight">プライバシーポリシー</h1>
  <div class="${BLOG_CONTENT_CLASS} mt-8">
    <h2>広告について</h2>
    <p>当サイトでは、Google AdSenseを利用して広告を配信する場合があります。Googleなどの第三者配信事業者は、Cookieを使用して、当サイトや他のサイトへの過去のアクセス情報に基づいた広告を配信することがあります。</p>
    <p>ユーザーはGoogleの<a href="https://www.google.com/settings/ads">広告設定</a>からパーソナライズド広告を無効にできます。また、<a href="https://www.aboutads.info/">www.aboutads.info</a>から第三者配信事業者によるCookieの使用を無効にできます。</p>
    <h2>アクセス解析について</h2>
    <p>当サイトでは、利用状況を把握するためGoogle Analyticsを利用しています。収集される情報には、アクセス日時、閲覧ページ、ブラウザやOSの情報などが含まれます。詳細は<a href="https://policies.google.com/privacy">Googleのプライバシーポリシー</a>をご確認ください。</p>
    <h2>お問い合わせ</h2>
    <p>運営者情報や連絡先については、<a href="https://github.com/s-yoshiki">GitHubプロフィール</a>をご確認ください。</p>
    <p class="text-sm text-muted-foreground">制定日: 2026-08-13</p>
  </div>
</article>`;
}

export function blogContent(): Plugin {
  return {
    name: "ex-foundry:blog-content",
    resolveId(id) {
      return id === BLOG_CONTENT_MODULE ? RESOLVED_BLOG_CONTENT_MODULE : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_BLOG_CONTENT_MODULE) return undefined;

      const posts = await loadBlogSummaries(process.cwd());
      return `export const BLOG_POSTS = ${JSON.stringify(posts)};`;
    },
  };
}
