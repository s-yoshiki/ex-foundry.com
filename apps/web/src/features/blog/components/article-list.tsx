import { useMemo } from "react";
import { Link } from "../../../routing/link";
import { useNavigation } from "../../../routing/navigation-context";
import { getBlogPosts } from "../functions/get-blog-posts";
import { BlogPostBand } from "./blog-post-band";
import { BlogSearch } from "./blog-search";

export function ArticleList() {
  const { location } = useNavigation();
  const posts = getBlogPosts();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const query = params.get("q")?.trim().toLocaleLowerCase() ?? "";
  const tag = params.get("tag") ?? "";
  const year = params.get("year") ?? "";
  const month = params.get("month") ?? "";
  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesQuery =
          query === "" ||
          [post.title, post.description, ...post.tags]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query);
        const matchesTag = tag === "" || post.tags.includes(tag);
        const matchesDate =
          (year === "" || post.publishedOn.startsWith(year)) &&
          (month === "" || post.publishedOn.startsWith(`${year}-${month}`));

        return matchesQuery && matchesTag && matchesDate;
      }),
    [month, posts, query, tag, year],
  );
  const hasFilter = query !== "" || tag !== "" || year !== "" || month !== "";

  return (
    <section aria-labelledby="articles-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-5 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">
            KNOWLEDGE BASE
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl" id="articles-heading">
            技術記事
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            EX FOUNDRYのアプリケーション開発、設計、運用で得た知見を、再現できる形で記録しています。
          </p>
        </div>
        <BlogSearch />
      </div>

      <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredPosts.length}件の記事
          {hasFilter ? "（絞り込み中）" : ""}
        </span>
        {hasFilter ? (
          <Link className="underline" to="articles">
            絞り込みを解除
          </Link>
        ) : null}
      </div>

      <BlogPostBand posts={filteredPosts} />
    </section>
  );
}
