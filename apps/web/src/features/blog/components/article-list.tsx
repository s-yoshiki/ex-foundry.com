import { CalendarDays, Hash } from "lucide-react";
import { useMemo } from "react";
import { PageHero } from "../../../components/page-hero";
import { Link } from "../../../routing/link";
import { useNavigation } from "../../../routing/navigation-context";
import {
  getBlogArchive,
  getBlogContentTypeCounts,
  getBlogPosts,
  getBlogTagCounts,
} from "../functions/get-blog-posts";
import type { BlogContentType } from "../types/blog-post";
import { getBlogProductLabel } from "../types/blog-post";
import { BlogArchive } from "./blog-archive";
import { BlogPostBand } from "./blog-post-band";
import { BlogSearch } from "./blog-search";
import { BlogSectionHeading } from "./blog-section-heading";
import { BlogTag } from "./blog-tag";

export function ArticleList() {
  const { location } = useNavigation();
  const posts = getBlogPosts();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const query = params.get("q")?.trim().toLocaleLowerCase() ?? "";
  const tag = params.get("tag") ?? "";
  const year = params.get("year") ?? "";
  const month = params.get("month") ?? "";
  const type = params.get("type") ?? "";
  const product = params.get("product") ?? "";
  const contentType = type as BlogContentType;
  const contentTypeCounts = getBlogContentTypeCounts();
  const tags = getBlogTagCounts().slice(0, 30);
  const archive = getBlogArchive();
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
        const matchesProduct = product === "" || post.product === product;

        return matchesQuery && matchesTag && matchesDate && matchesType && matchesProduct;
      }),
    [contentType, month, posts, product, query, tag, type, year],
  );
  const hasFilter =
    query !== "" || tag !== "" || year !== "" || month !== "" || type !== "" || product !== "";

  return (
    <section aria-labelledby="articles-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHero
        action={<BlogSearch />}
        bordered
        className="mb-8"
        description="EX FOUNDRYで提供しているプロダクトの目的、技術構成、リリース情報、運用上の判断を公式情報として公開しています。"
        eyebrow="KNOWLEDGE BASE"
        title="プロダクト情報"
        titleId="articles-heading"
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
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
              {product !== "" ? `${getBlogProductLabel(product)}の` : ""}
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
        </div>

        <div className="grid gap-8">
          <div>
            <BlogSectionHeading icon={Hash} title="タグから探す" />
            <div className="flex flex-wrap gap-2">
              {tags.map((tagOption) => (
                <BlogTag key={tagOption.name} {...tagOption} />
              ))}
            </div>
          </div>
          <div>
            <BlogSectionHeading icon={CalendarDays} title="アーカイブ" />
            <BlogArchive archive={archive} />
          </div>
        </div>
      </div>
    </section>
  );
}
