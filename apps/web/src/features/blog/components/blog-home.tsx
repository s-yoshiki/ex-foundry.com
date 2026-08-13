import { LayoutGrid, Sparkles } from "lucide-react";
import { PageHero } from "../../../components/page-hero";
import { Link } from "../../../routing/link";
import { ApplicationCard } from "../../app-directory/components/application-card";
import { getApplications } from "../../app-directory/functions/get-applications";
import { getBlogPosts } from "../functions/get-blog-posts";
import { BlogPostBand } from "./blog-post-band";
import { BlogSearch } from "./blog-search";
import { BlogSectionHeading } from "./blog-section-heading";

const LATEST_POST_COUNT = 6;

export function BlogHome() {
  const applications = getApplications();
  const posts = getBlogPosts();
  const latestPosts = posts.slice(0, LATEST_POST_COUNT);

  return (
    <div>
      <section aria-labelledby="home-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <PageHero
          action={<BlogSearch />}
          bordered
          description="DevToys for web、クソゲーの森、ひまつぶし研究室、NPB Analysisを継続的に開発し、目的・技術構成・リリース内容を記事として公開しています。"
          eyebrow="EX FOUNDRY"
          title="個人開発プロダクトを、動くところまで公開する"
          titleId="home-heading"
        />
      </section>

      <section aria-labelledby="products-heading" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <BlogSectionHeading
          action={
            <Link
              className="text-sm font-medium text-muted-foreground no-underline hover:text-foreground"
              to="apps"
            >
              アプリ一覧へ
            </Link>
          }
          as="h1"
          icon={LayoutGrid}
          id="products-heading"
          title="プロダクト"
        />
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {applications.map((application) => (
            <ApplicationCard application={application} key={application.host} />
          ))}
        </div>
      </section>

      <section aria-labelledby="updates-heading" className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <BlogSectionHeading
            action={
              <div className="flex items-center gap-4 text-sm">
                <Link
                  className="font-medium text-muted-foreground no-underline hover:text-foreground"
                  to="changelog"
                >
                  更新履歴
                </Link>
                <Link
                  className="font-medium text-muted-foreground no-underline hover:text-foreground"
                  to="articles"
                >
                  すべての記事
                </Link>
              </div>
            }
            icon={Sparkles}
            id="updates-heading"
            title="最新の更新"
          />
          <BlogPostBand posts={latestPosts} />
        </div>
      </section>
    </div>
  );
}
