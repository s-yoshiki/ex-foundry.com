import { Bot, CalendarDays, ChevronRight, Clock3, Sparkles, TriangleAlert } from "lucide-react";
import { useId } from "react";
import { useNavigation } from "../../../routing/navigation-context";
import { useDocumentMeta } from "../../../routing/use-document-meta";
import { findBlogPost, getBlogPostId, getRecommendedBlogPosts } from "../functions/get-blog-posts";
import { BLOG_CONTENT_TYPE_LABELS, getBlogProductLabel } from "../types/blog-post";
import { AiGeneratedBadge } from "./ai-generated-badge";
import { ArticleContent } from "./article-content";
import { ArticleTableOfContents } from "./article-table-of-contents";
import { BlogPostBand } from "./blog-post-band";

type ArticlePageProps = {
  /** Pre-rendered body, supplied only by the SSR entry point. */
  presetHtml?: string;
};

export function ArticlePage({ presetHtml }: ArticlePageProps = {}) {
  const articleContentId = useId();
  const feedbackHeadingId = useId();
  const { location } = useNavigation();
  const id = getBlogPostId(location.pathname);
  const post = id === undefined ? undefined : findBlogPost(id);
  const articleRoute = post
    ? {
        description: post.description,
        id: "articles" as const,
        navLabel: "プロダクト情報",
        path: `${post.path}/`,
        title: `${post.title} - EX FOUNDRY`,
      }
    : {
        description: "指定された記事は存在しないか、移動しました。",
        id: "articles" as const,
        navLabel: "プロダクト情報",
        path: "/articles/",
        title: "記事が見つかりません - EX FOUNDRY",
      };

  useDocumentMeta(articleRoute);

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-bold">記事が見つかりません</h1>
        <p className="mt-4 text-muted-foreground">指定された記事は存在しないか、移動しました。</p>
        <a className="mt-8 inline-block font-semibold text-primary" href="/articles/">
          プロダクト情報一覧へ戻る
        </a>
      </section>
    );
  }

  const isOlderArticle =
    new Date(`${post.publishedOn}T00:00:00Z`).getTime() <
    new Date(Date.now() - 2 * 365.25 * 24 * 60 * 60 * 1000).getTime();
  const recommendedPosts = getRecommendedBlogPosts(post);

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="パンくずリスト" className="mb-6">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li>
                <a className="no-underline hover:text-foreground" href="/">
                  プロダクト情報
                </a>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="truncate">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            {post.coverImage ? (
              <span className="hidden size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted p-2 sm:grid">
                <img
                  alt=""
                  aria-hidden="true"
                  className="size-full object-contain"
                  src={post.coverImage}
                />
              </span>
            ) : null}
            <div className="min-w-0">
              <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-4" />
                  <time dateTime={post.publishedOn}>{post.publishedOn}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 aria-hidden="true" className="size-4" />約 {post.readingMinutes} 分
                </span>
                <span>著者 {post.author}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  {BLOG_CONTENT_TYPE_LABELS[post.contentType]}
                </span>
                <span className="text-muted-foreground">{getBlogProductLabel(post.product)}</span>
              </div>
              {post.aiGenerated ? (
                <div className="mt-4">
                  <AiGeneratedBadge />
                </div>
              ) : null}
            </div>
          </div>

          {post.tags.length > 0 ? (
            <ul aria-label="タグ" className="mt-6 flex flex-wrap gap-2">
              {post.tags.slice(0, 8).map((tag) => (
                <li
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                  key={tag}
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            {post.aiGenerated ? (
              <aside
                aria-label="AI生成記事についての説明"
                className="mb-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary"
              >
                <Bot aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p>
                  この記事は生成AIを活用して作成されています。内容は公開時点の情報をもとにしているため、最新の仕様や重要な判断については公式ドキュメントも確認してください。
                </p>
              </aside>
            ) : null}
            {isOlderArticle ? (
              <aside
                aria-label="古い記事についての注意"
                className="mb-8 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200"
              >
                <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p>
                  この記事は公開から2年以上経過しています。画面、料金、ライブラリやサービスの仕様が現在と異なる可能性があるため、公式資料も併せて確認してください。
                </p>
              </aside>
            ) : null}
            <ArticleTableOfContents items={post.toc} variant="inline" />
            <div id={articleContentId}>
              <ArticleContent path={post.contentPath} presetHtml={presetHtml} />
            </div>
            <section
              aria-labelledby={feedbackHeadingId}
              className="mt-10 rounded-xl border border-border bg-card p-5"
            >
              <h2 className="text-lg font-semibold tracking-tight" id={feedbackHeadingId}>
                記事の更新・修正
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                内容の誤り、リンク切れ、現在の仕様との不一致を見つけた場合は、お問い合わせページから知らせてください。
              </p>
              <a
                className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                href="/contact/"
              >
                修正・更新を知らせる
              </a>
            </section>
            <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
              <a href="/articles/">プロダクト情報一覧へ戻る</a>
            </footer>
          </div>
          <ArticleTableOfContents items={post.toc} variant="sidebar" />
        </div>
      </div>

      {recommendedPosts.length > 0 ? (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold tracking-tight">
              <Sparkles aria-hidden="true" className="size-5 text-primary" />
              おすすめの記事
            </h2>
            <BlogPostBand posts={recommendedPosts} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
