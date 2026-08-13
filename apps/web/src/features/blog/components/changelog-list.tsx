import { useMemo } from "react";
import { PageHero } from "../../../components/page-hero";
import { getBlogPosts } from "../functions/get-blog-posts";
import { BlogPostCard } from "./blog-post-card";

export function ChangelogList() {
  const releases = useMemo(
    () => getBlogPosts().filter((post) => post.contentType === "release"),
    [],
  );

  return (
    <section aria-labelledby="changelog-heading" className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageHero
        description="DevToys for web、クソゲーの森、ひまつぶし研究室、NPB Analysis、EX FOUNDRY自体のリリース記事を日付順にまとめています。"
        eyebrow="CHANGELOG"
        title="更新履歴"
        titleId="changelog-heading"
      />

      {releases.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          リリース記事はまだありません。
        </p>
      ) : (
        <ol className="mt-10 grid list-none gap-3.5 p-0">
          {releases.map((post) => (
            <li key={post.path}>
              <BlogPostCard post={post} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
