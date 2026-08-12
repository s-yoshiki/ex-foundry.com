import { getBlogPosts } from "../functions/get-blog-posts";

export function ArticleList() {
  const posts = getBlogPosts();

  return (
    <section aria-labelledby="articles-heading">
      <p className="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">
        KNOWLEDGE BASE
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl" id="articles-heading">
        技術記事
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        EX FOUNDRYのアプリケーション開発、設計、運用で得た知見を、再現できる形で記録しています。
      </p>
      <p className="mt-6 text-sm text-muted-foreground">{posts.length}件の記事</p>

      <ul className="mt-6 grid list-none gap-4 p-0 md:grid-cols-2">
        {posts.map((post) => (
          <li className="rounded-xl border p-5" key={post.path}>
            <p className="font-mono text-xs text-muted-foreground">{post.publishedOn}</p>
            <h2 className="mt-2 text-xl font-semibold">
              <a href={`${post.path}/`}>{post.title}</a>
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{post.description}</p>
            <ul aria-label="タグ" className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 5).map((tag) => (
                <li className="rounded-full bg-secondary px-2.5 py-1 text-xs" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
