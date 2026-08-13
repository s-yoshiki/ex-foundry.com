import { useNavigation } from "../../../routing/navigation-context";
import { useDocumentMeta } from "../../../routing/use-document-meta";
import { findBlogPost, getBlogPostId } from "../functions/get-blog-posts";
import { AiGeneratedBadge } from "./ai-generated-badge";
import { ArticleContent } from "./article-content";

export function ArticlePage() {
  const { location } = useNavigation();
  const id = getBlogPostId(location.pathname);
  const post = id === undefined ? undefined : findBlogPost(id);
  const articleRoute = post
    ? {
        description: post.description,
        id: "articles" as const,
        navLabel: "技術記事",
        path: `${post.path}/`,
        title: `${post.title} - EX FOUNDRY`,
      }
    : {
        description: "指定された記事は存在しないか、移動しました。",
        id: "articles" as const,
        navLabel: "技術記事",
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
          技術記事一覧へ戻る
        </a>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="パンくずリスト" className="mb-8 text-sm text-muted-foreground">
        <a href="/">EX FOUNDRY</a> <span aria-hidden="true">/</span> <a href="/articles/">記事</a>{" "}
        <span aria-hidden="true">/</span> <span>{post.title}</span>
      </nav>

      <header className="mb-10 border-b pb-8">
        <p className="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">
          TECHNICAL NOTE
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.publishedOn}>{post.publishedOn}</time> · {post.author}
          {post.aiGenerated ? <AiGeneratedBadge /> : null}
        </p>
        <ul aria-label="タグ" className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <ArticleContent path={post.contentPath} />

      <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        <a href="/articles/">記事一覧へ戻る</a>
      </footer>
    </article>
  );
}
