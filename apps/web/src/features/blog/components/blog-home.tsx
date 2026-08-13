import { CalendarDays, Hash, TrendingUp, UserRound } from "lucide-react";
import { Link } from "../../../routing/link";
import {
  getBlogArchive,
  getBlogPosts,
  getBlogTagCounts,
  getPopularBlogPosts,
} from "../functions/get-blog-posts";
import { AuthorProfile } from "./author-profile";
import { BlogArchive } from "./blog-archive";
import { BlogPostBand } from "./blog-post-band";
import { BlogSearch } from "./blog-search";
import { BlogSectionHeading } from "./blog-section-heading";
import { BlogTag } from "./blog-tag";

const INITIAL_POST_COUNT = 15;

export function BlogHome() {
  const posts = getBlogPosts();
  const popularPosts = getPopularBlogPosts();
  const tags = getBlogTagCounts().slice(0, 30);
  const archive = getBlogArchive();
  const visiblePosts = posts.slice(0, INITIAL_POST_COUNT);

  return (
    <div>
      <section aria-labelledby="home-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs tracking-[0.12em] text-primary uppercase">
              DEVELOPMENT JOURNAL
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl" id="home-heading">
              新着記事
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              個人開発したWebアプリケーションと、設計・実装・運用で得た知見を再現できる形で記録しています。
            </p>
          </div>
          <BlogSearch />
        </div>
        <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{visiblePosts.length}件を表示中</span>
          <span>全{posts.length}件</span>
        </div>
        <BlogPostBand posts={visiblePosts} />
        {posts.length > visiblePosts.length ? (
          <div className="mt-8 text-center">
            <Link
              className="inline-flex rounded-full border px-4 py-2 text-sm font-medium no-underline transition-colors hover:bg-muted"
              to="articles"
            >
              すべての記事を見る
            </Link>
          </div>
        ) : null}
      </section>

      <section aria-labelledby="popular-heading" className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <BlogSectionHeading
            action={<span className="text-xs text-muted-foreground">{popularPosts.length}件</span>}
            icon={TrendingUp}
            id="popular-heading"
            title="よく読まれている記事"
          />
          <BlogPostBand posts={popularPosts} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <BlogSectionHeading icon={Hash} title="タグから探す" />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <BlogTag key={tag.name} {...tag} />
              ))}
            </div>
          </div>
          <div>
            <BlogSectionHeading icon={CalendarDays} id="archive-heading" title="アーカイブ" />
            <BlogArchive archive={archive} />
          </div>
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <BlogSectionHeading icon={UserRound} id="author-heading" title="運営者" />
          <AuthorProfile />
          <p className="mt-4 text-xs text-muted-foreground">
            公開中のアプリケーションは
            <Link className="mx-1 underline" to="apps">
              アプリ一覧
            </Link>
            から確認できます。
          </p>
        </div>
      </section>
    </div>
  );
}
