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
import type { Application } from "../src/features/app-directory/types/application";
import { BLOG_CONTENT_CLASS } from "../src/features/blog/functions/blog-content-style";
import {
  CONTACT_CHANNELS,
  EDITORIAL_POLICY_SECTIONS,
  EDITORIAL_POLICY_STEPS,
} from "../src/features/site-guidance/content";

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
  readingMinutes: number;
  toc: readonly { id: string; label: string }[];
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

function estimateReadingMinutes(html: string): number {
  const document = cheerio.load(html, null, false);
  const text = document.root().text().replace(/\s+/g, "");
  return Math.max(1, Math.ceil(text.length / 500));
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

export function renderArticleContent(post: BuiltBlogPost): string {
  const tags = post.tags
    .map(
      (tag) =>
        `<li class="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">${escapeHtml(tag)}</li>`,
    )
    .join("");
  const aiBadge = post.aiGenerated
    ? `<span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">AI補助</span>`
    : "";
  const toc = post.toc.length
    ? `<nav aria-label="記事内目次" class="mb-10 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"><h2 class="mb-4 text-lg font-bold tracking-tight">目次</h2><ol class="grid gap-1 sm:grid-cols-2 sm:gap-x-8">${post.toc
        .map(
          (item) =>
            `<li><a class="block rounded-md px-3 py-2 text-sm text-muted-foreground no-underline hover:bg-muted hover:text-foreground" href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`,
        )
        .join("")}</ol></nav>`
    : "";
  const isOlderArticle =
    new Date(`${post.publishedOn}T00:00:00Z`).getTime() <
    Date.now() - 2 * 365.25 * 24 * 60 * 60 * 1000;
  const aiNotice = post.aiGenerated
    ? `<aside aria-label="AI生成記事についての説明" class="mb-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary"><span aria-hidden="true" class="mt-0.5 size-5 shrink-0">✦</span><p>この記事は生成AIを活用して作成されています。内容は公開時点の情報をもとにしているため、最新の仕様や重要な判断については公式ドキュメントも確認してください。</p></aside>`
    : "";
  const olderNotice = isOlderArticle
    ? `<aside aria-label="古い記事についての注意" class="mb-8 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200"><span aria-hidden="true" class="mt-0.5 size-5 shrink-0">⚠</span><p>この記事は公開から2年以上経過しています。画面、料金、ライブラリやサービスの仕様が現在と異なる可能性があるため、公式資料も併せて確認してください。</p></aside>`
    : "";
  const coverImage = post.coverImage
    ? `<span class="hidden size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted p-2 sm:grid"><img alt="" aria-hidden="true" class="size-full object-contain" src="${escapeHtml(post.coverImage)}" /></span>`
    : "";
  const sidebarToc = post.toc.length
    ? `<aside class="hidden lg:block"><nav aria-label="サイドバー目次" class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"><h2 class="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">目次</h2><ol class="space-y-px border-l border-border text-sm">${post.toc
        .map(
          (item) =>
            `<li><a class="-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-muted-foreground no-underline hover:border-border hover:text-foreground" href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`,
        )
        .join("")}</ol></nav></aside>`
    : "";

  return `<article>
  <header class="border-b border-border"><div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
    <nav aria-label="パンくずリスト" class="mb-6"><ol class="flex items-center gap-1 text-sm text-muted-foreground"><li><a href="/" class="no-underline hover:text-foreground">記事</a></li><li aria-hidden="true">›</li><li aria-current="page" class="truncate">${escapeHtml(post.title)}</li></ol></nav>
    <div class="flex items-start gap-4">${coverImage}<div class="min-w-0"><h1 class="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-4xl">${escapeHtml(post.title)}</h1><div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"><span>◷ <time datetime="${escapeHtml(post.publishedOn)}">${escapeHtml(post.publishedOn)}</time></span><span>著者 ${escapeHtml(post.author)}</span><span>◷ 約${post.readingMinutes}分</span></div>${aiBadge ? `<div class="mt-4">${aiBadge}</div>` : ""}</div></div>
    <ul class="mt-6 flex flex-wrap gap-2" aria-label="タグ">${tags}</ul>
  </div></header>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div class="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_240px]"><div class="min-w-0">${aiNotice}${olderNotice}${toc}<div id="article-content" class="${BLOG_CONTENT_CLASS} max-w-none">${post.html}</div><section aria-labelledby="article-feedback-heading" class="mt-10 rounded-xl border border-border bg-card p-5"><h2 id="article-feedback-heading" class="text-lg font-semibold tracking-tight">記事の更新・修正</h2><p class="mt-2 text-sm leading-relaxed text-muted-foreground">内容の誤り、リンク切れ、現在の仕様との不一致を見つけた場合は、お問い合わせページから知らせてください。</p><a class="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline" href="/contact/">修正・更新を知らせる</a></section><footer class="mt-12 border-t pt-6 text-sm text-muted-foreground"><a href="/articles/">記事一覧へ戻る</a></footer></div>${sidebarToc}</div></div>
</article>`;
}

function renderBlogPostCard(post: BlogPostSummary): string {
  const tags = post.tags
    .slice(0, 3)
    .map(
      (tag) =>
        `<li class="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">${escapeHtml(tag)}</li>`,
    )
    .join("");
  const aiBadge = post.aiGenerated
    ? `<span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">AI補助</span>`
    : "";
  const thumbnail = post.coverImage
    ? `<img src="${escapeHtml(post.coverImage)}" alt="" aria-hidden="true" class="size-full object-contain" />`
    : "EX";

  return `<article class="group relative flex w-full gap-3.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25 hover:bg-muted/40">
  <div class="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted text-xs font-bold text-muted-foreground">${thumbnail}</div>
  <div class="min-w-0 flex-1">
    <div class="flex items-center gap-2 text-[11px] text-muted-foreground"><time datetime="${escapeHtml(post.publishedOn)}">${escapeHtml(post.publishedOn)}</time>${aiBadge}<span class="ml-auto" aria-hidden="true">↗</span></div>
    <h2 class="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug tracking-tight sm:text-[15px]"><a class="after:absolute after:inset-0" href="${escapeHtml(`${post.path}/`)}">${escapeHtml(post.title)}</a></h2>
    <ul class="mt-2.5 flex flex-wrap gap-1.5" aria-label="タグ">${tags}</ul>
  </div>
</article>`;
}

function renderBlogPostBand(posts: readonly BlogPostSummary[]): string {
  return `<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">${posts.map(renderBlogPostCard).join("")}</div>`;
}

export function renderArticleIndex(posts: readonly BlogPostSummary[]): string {
  return `<section aria-labelledby="articles-heading" class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
  <div class="mb-8 flex flex-col gap-5 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
    <div>
  <p class="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">KNOWLEDGE BASE</p>
  <h1 id="articles-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">技術記事</h1>
  <p class="mt-4 max-w-2xl leading-relaxed text-muted-foreground">EX FOUNDRYのアプリケーション開発、設計、運用で得た知見を、再現できる形で記録しています。</p>
    </div>
    <form action="/articles/" class="relative w-full max-w-xl" method="get" role="search" aria-label="記事を検索">
      <span aria-hidden="true" class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">⌕</span>
      <input aria-label="記事を検索" class="h-9 w-full rounded-full border bg-background px-9 text-sm" name="q" placeholder="記事を検索" type="search" />
    </form>
  </div>
  <p class="mb-5 text-sm text-muted-foreground">${posts.length}件の記事</p>
  ${renderBlogPostBand(posts)}
</section>`;
}

export function renderStaticHome(posts: readonly BlogPostSummary[]): string {
  const tagCounts = new Map<string, number>();
  const archive = new Map<string, Map<string, number>>();

  for (const post of posts) {
    for (const tag of post.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);

    const year = post.publishedOn.slice(0, 4);
    const month = post.publishedOn.slice(5, 7);
    const months = archive.get(year) ?? new Map<string, number>();
    months.set(month, (months.get(month) ?? 0) + 1);
    archive.set(year, months);
  }

  const tags = [...tagCounts.entries()]
    .sort(
      ([leftName, leftCount], [rightName, rightCount]) =>
        rightCount - leftCount || leftName.localeCompare(rightName, "ja"),
    )
    .slice(0, 30)
    .map(
      ([name, count]) =>
        `<a class="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs no-underline" href="/articles/?tag=${encodeURIComponent(name)}"><span aria-hidden="true" class="size-1.5 rounded-full bg-primary"></span>${escapeHtml(name)} <span class="text-muted-foreground">${count}</span></a>`,
    )
    .join("");

  const archiveHtml = [...archive.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([year, months], index) => {
      const count = [...months.values()].reduce((total, value) => total + value, 0);
      const monthLinks = [...months.entries()]
        .sort(([left], [right]) => right.localeCompare(left))
        .map(
          ([month, monthCount]) =>
            `<li><a class="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground no-underline hover:bg-muted hover:text-foreground" href="/articles/?year=${year}&month=${month}"><span>⌑ ${Number(month)}月</span><span>${monthCount}件</span></a></li>`,
        )
        .join("");

      return `<details class="group border-b last:border-0"${index === 0 ? " open" : ""}><summary class="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold">${year}<span class="text-xs font-normal text-muted-foreground">${count}件</span></summary><ul class="mb-2 grid gap-1 pl-3">${monthLinks}</ul></details>`;
    })
    .join("");

  const popularPaths = new Set<string>(POPULAR_POST_PATHS);
  const popular = posts.filter((post) => popularPaths.has(post.path));

  return `<div>
  <section aria-labelledby="home-heading" class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <div class="mb-6 flex flex-col gap-4 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="mb-2 font-mono text-xs tracking-[0.12em] text-primary uppercase">DEVELOPMENT JOURNAL</p>
        <h1 id="home-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">新着記事</h1>
        <p class="mt-4 max-w-2xl leading-relaxed text-muted-foreground">個人開発したWebアプリケーションと、設計・実装・運用で得た知見を再現できる形で記録しています。</p>
      </div>
      <form action="/articles/" class="relative w-full max-w-xl" method="get" role="search" aria-label="記事を検索"><span aria-hidden="true" class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">⌕</span><input aria-label="記事を検索" class="h-9 w-full rounded-full border bg-background px-9 text-sm" name="q" placeholder="記事を検索" type="search" /></form>
    </div>
    <div class="mb-5 flex items-center justify-between text-xs text-muted-foreground"><span>${Math.min(posts.length, 15)}件を表示中</span><span>全${posts.length}件</span></div>
    ${renderBlogPostBand(posts.slice(0, 15))}
    ${posts.length > 15 ? '<div class="mt-8 text-center"><a class="inline-flex rounded-full border px-4 py-2 text-sm font-medium no-underline" href="/articles/">すべての記事を見る</a></div>' : ""}
  </section>
  <section aria-labelledby="popular-heading" class="border-y bg-card"><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div class="mb-5 flex items-center justify-between gap-4"><h2 id="popular-heading" class="text-xl font-semibold tracking-tight">よく読まれている記事</h2><span class="text-xs text-muted-foreground">${popular.length}件</span></div>${renderBlogPostBand(popular)}</div></section>
  <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]"><div><h2 class="mb-5 text-xl font-semibold tracking-tight">タグから探す</h2><div class="flex flex-wrap gap-2">${tags}</div></div><div><h2 class="mb-5 text-xl font-semibold tracking-tight">アーカイブ</h2><div class="rounded-xl border bg-card p-4">${archiveHtml}</div></div></div></section>
  <section class="border-t bg-card"><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6"><h2 class="mb-5 text-xl font-semibold tracking-tight">運営者</h2><div class="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-center gap-4"><div class="grid size-14 shrink-0 place-items-center rounded-xl bg-primary font-mono text-lg font-extrabold text-primary-foreground">EX</div><div><p class="font-semibold">s-yoshiki</p><p class="mt-1 text-sm text-muted-foreground">個人開発と技術の記録を公開しています。</p></div></div><a class="text-sm font-medium no-underline" href="https://github.com/s-yoshiki" rel="noreferrer">GitHub ↗</a></div><p class="mt-4 text-xs text-muted-foreground">公開中のアプリケーションは <a class="underline" href="/apps/">アプリ一覧</a> から確認できます。</p></div></section>
</div>`;
}

export function renderStaticApps(applications: readonly Application[]): string {
  const applicationsHtml = applications
    .map(
      (application) => `<li class="rounded-xl border p-5">
  <h2 class="text-xl font-semibold"><a href="https://${escapeHtml(application.host)}/">${escapeHtml(application.name)}</a></h2>
  <p class="mt-3 leading-relaxed text-muted-foreground">${escapeHtml(application.description)}</p>
  <p class="mt-3 text-xs text-muted-foreground">${escapeHtml(application.stack.join(" · "))}</p>
</li>`,
    )
    .join("");
  return `<section aria-labelledby="apps-heading" class="mx-auto max-w-7xl px-4 py-12 sm:px-6"><h1 id="apps-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">公開中のWebアプリケーション</h1><p class="mt-5 max-w-2xl leading-relaxed text-muted-foreground">開発や日々の作業で欲しくなった道具を、小さなWebアプリケーションとして公開しています。各アプリは登録なしで利用できます。</p><section aria-labelledby="applications-heading" class="mt-12"><h2 id="applications-heading" class="mb-5 font-mono text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">アプリケーション</h2><ul class="grid list-none gap-3.5 p-0">${applicationsHtml}</ul></section></section>`;
}

export function renderStaticAbout(): string {
  return `<section aria-labelledby="about-heading" class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
  <h1 id="about-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">EX FOUNDRYについて</h1>
  <div class="blog-content mt-8 max-w-2xl">
    <p>EX FOUNDRYは、日々の作業で欲しくなった小さなWebアプリケーションを作って公開している個人プロジェクトです。すべてブラウザだけで利用でき、ログインを必須にしないことを基本にしています。</p>
    <p>アプリケーション本体だけでなく、設計上の判断、実装の過程、テストや運用で得た知見も技術記事として記録しています。記事は課題、前提となる環境、実装、確認結果、制約をできるだけ分けて説明します。</p>
    <p>運営者はs-yoshikiです。ソースコードは<a href="https://github.com/s-yoshiki/ex-foundry.com">GitHub</a>で公開し、GitHub ActionsとGitHub Pagesを使って静的サイトとして配信しています。</p>
    <p><a href="/editorial-policy/">編集方針</a>では記事の作成、更新、生成AIの利用について、<a href="/contact/">お問い合わせ</a>では記事やアプリの修正依頼について説明しています。</p>
  </div>
</section>`;
}

export function renderStaticContact(): string {
  const channels = CONTACT_CHANNELS.map(
    (channel) =>
      `<article class="rounded-xl border bg-card p-5"><h2 class="text-lg font-semibold tracking-tight">${escapeHtml(channel.title)}</h2><p class="mt-2 text-sm leading-relaxed text-muted-foreground">${escapeHtml(channel.description)}</p><a class="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline" href="${escapeHtml(channel.href)}" rel="noreferrer" target="_blank">${escapeHtml(channel.label)} ↗</a></article>`,
  ).join("");

  return `<section aria-labelledby="contact-heading" class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14"><p class="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">CONTACT</p><h1 id="contact-heading" class="text-3xl font-bold tracking-tight sm:text-5xl">お問い合わせ</h1><p class="mt-5 max-w-2xl leading-relaxed text-muted-foreground">記事や公開中のアプリケーションについて、誤りの報告、更新情報、改善案を受け付けています。静的サイトのため、GitHub Issuesを公開の連絡窓口として利用しています。</p><div class="mt-10 grid gap-4">${channels}</div><p class="mt-8 text-sm leading-relaxed text-muted-foreground">連絡内容に個人情報や秘密情報を含めないでください。すべての問い合わせに返信できるとは限りませんが、確認した内容はサイトやアプリの改善に利用します。</p></section>`;
}

export function renderStaticEditorialPolicy(): string {
  const steps = EDITORIAL_POLICY_STEPS.map(
    (step, index) =>
      `<li class="flex items-start gap-3"><span class="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">${index + 1}</span><span class="pt-1 text-sm leading-relaxed">${escapeHtml(step)}</span></li>`,
  ).join("");
  const sections = EDITORIAL_POLICY_SECTIONS.map(
    (section, index) =>
      `<section aria-labelledby="policy-${index}"><h2 id="policy-${index}">${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>`,
  ).join("");

  return `<article class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14"><p class="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">EDITORIAL POLICY</p><h1 class="text-3xl font-bold tracking-tight sm:text-5xl">編集方針</h1><p class="mt-5 max-w-2xl leading-relaxed text-muted-foreground">EX FOUNDRYの記事をどのような目的で作成し、どのように更新・訂正しているかを説明します。</p><section aria-labelledby="publication-process-heading" class="mt-10 rounded-xl border bg-card p-5 sm:p-6"><h2 id="publication-process-heading" class="text-xl font-semibold tracking-tight">記事を公開するまで</h2><ol class="mt-5 grid gap-4">${steps}</ol></section><div class="${BLOG_CONTENT_CLASS} mt-10">${sections}</div></article>`;
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
      return `export const BLOG_POSTS = ${JSON.stringify(posts)};
export const BLOG_POPULAR_POST_PATHS = ${JSON.stringify(POPULAR_POST_PATHS)};`;
    },
  };
}
