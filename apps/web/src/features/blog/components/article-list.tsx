import { useMemo } from "react";
import { Link } from "../../../routing/link";
import { useNavigation } from "../../../routing/navigation-context";
import { getBlogContentTypeCounts, getBlogPosts } from "../functions/get-blog-posts";
import type { BlogContentType } from "../types/blog-post";
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
  const type = params.get("type") ?? "";
  const contentType = type as BlogContentType;
  const contentTypeCounts = getBlogContentTypeCounts();
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
        const matchesType = type === "" || post.contentType === contentType;

        return matchesQuery && matchesTag && matchesDate && matchesType;
      }),
    [contentType, month, posts, query, tag, type, year],
  );
  const hasFilter = query !== "" || tag !== "" || year !== "" || month !== "" || type !== "";

  return (
    <section aria-labelledby="articles-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-5 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.12em] text-primary uppercase">
            KNOWLEDGE BASE
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl" id="articles-heading">
            プロダクト情報
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            EX
            FOUNDRYで提供しているプロダクトの目的、技術構成、リリース情報、運用上の判断を公式情報として公開しています。
          </p>
        </div>
        <BlogSearch />
      </div>

      <nav aria-label="記事の分類" className="mb-6 flex flex-wrap gap-2">
        <Link
          className={`rounded-full border px-3 py-1.5 text-xs no-underline ${type === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          to="articles"
        >
          すべて
        </Link>
        {contentTypeCounts.map((option) => (
          <Link
            className={`rounded-full border px-3 py-1.5 text-xs no-underline ${type === option.type ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            key={option.type}
            search={`?type=${option.type}`}
            to="articles"
          >
            {option.label} {option.count}
          </Link>
        ))}
      </nav>

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
