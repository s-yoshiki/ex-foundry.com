import { STATUS_LABELS } from "../src/features/app-directory/functions/application-labels";
import type { Application } from "../src/features/app-directory/types/application";
import {
  BLOG_CONTENT_TYPE_LABELS,
  type BlogContentType,
} from "../src/features/blog/types/blog-post";
import { type BlogPostSummary, escapeHtml, renderBlogPostBand } from "./blog-content";

const CONTENT_TYPE_ORDER: readonly BlogContentType[] = [
  "product",
  "architecture",
  "release",
  "operations",
];

const CATEGORY_GLYPHS: Record<Application["category"], string> = {
  data: "▤",
  entertainment: "▶",
  tool: "✦",
};

export function renderProductDetail(
  application: Application,
  posts: readonly BlogPostSummary[],
): string {
  const productPosts = posts.filter((post) => post.product === application.slug);
  const glyph = CATEGORY_GLYPHS[application.category];
  const stack = application.stack
    .map(
      (tech) =>
        `<li class="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">${escapeHtml(tech)}</li>`,
    )
    .join("");

  const groupsHtml = CONTENT_TYPE_ORDER.map((type) => {
    const groupPosts = productPosts.filter((post) => post.contentType === type);
    if (groupPosts.length === 0) return "";

    return `<section aria-labelledby="product-${type}"><h2 id="product-${type}" class="mb-5 text-xl font-semibold tracking-tight">${escapeHtml(BLOG_CONTENT_TYPE_LABELS[type])}<span class="ml-2 text-sm font-normal text-muted-foreground">${groupPosts.length}件</span></h2>${renderBlogPostBand(groupPosts)}</section>`;
  })
    .filter((section) => section !== "")
    .join("");

  const body = groupsHtml
    ? `<div class="grid gap-12">${groupsHtml}</div>`
    : `<p class="rounded-xl border border-dashed p-8 text-center text-muted-foreground">まだこのプロダクトに関する記事がありません。</p>`;

  return `<article>
  <header class="border-b border-border"><div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
    <nav aria-label="パンくずリスト" class="mb-6"><ol class="flex items-center gap-1 text-sm text-muted-foreground"><li><a href="/apps/" class="no-underline hover:text-foreground">アプリ一覧</a></li><li aria-hidden="true">›</li><li aria-current="page" class="truncate">${escapeHtml(application.name)}</li></ol></nav>
    <div class="flex items-start gap-4">
      <span aria-hidden="true" class="grid size-14 shrink-0 place-items-center rounded-xl border border-border bg-primary/10 text-xl text-primary">${glyph}</span>
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2.5"><h1 class="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">${escapeHtml(application.name)}</h1><span class="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">${escapeHtml(STATUS_LABELS[application.status])}</span></div>
        <p class="mt-2 font-mono text-sm text-primary">${escapeHtml(application.host)}</p>
      </div>
    </div>
    <p class="mt-6 max-w-2xl leading-relaxed text-muted-foreground">${escapeHtml(application.description)}</p>
    <ul aria-label="技術スタック" class="mt-5 flex flex-wrap gap-2">${stack}</ul>
    <div class="mt-7 flex flex-wrap gap-3">
      <a class="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground no-underline" href="https://${escapeHtml(application.host)}/" rel="noreferrer" target="_blank">アプリを開く ↗</a>
      <a class="inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium no-underline hover:bg-muted" href="/articles/?product=${escapeHtml(application.slug)}">関連記事をすべて見る（${productPosts.length}件）</a>
    </div>
  </div></header>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">${body}</div>
</article>`;
}
