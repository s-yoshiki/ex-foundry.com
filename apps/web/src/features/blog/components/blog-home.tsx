import { Sparkles } from "lucide-react";
import { useId } from "react";
import { Link } from "../../../routing/link";
import { ApplicationCard } from "../../app-directory/components/application-card";
import { getApplications } from "../../app-directory/functions/get-applications";
import { getBlogPosts } from "../functions/get-blog-posts";
import { BlogPostBand } from "./blog-post-band";
import { BlogSectionHeading } from "./blog-section-heading";

const LATEST_POST_COUNT = 3;

export function BlogHome() {
  const productsHeadingId = useId();
  const applications = getApplications();
  const posts = getBlogPosts();
  const latestPosts = posts.slice(0, LATEST_POST_COUNT);

  return (
    <div>
      <section
        aria-labelledby={productsHeadingId}
        className="mx-auto max-w-7xl px-4 pt-9 pb-12 sm:px-6 sm:pt-12 sm:pb-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              EX FOUNDRY / PRODUCTS
            </p>
            <h1
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
              id={productsHeadingId}
            >
              プロダクト一覧
            </h1>
          </div>
          <p className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{applications.length}</span>件公開中
          </p>
        </div>

        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {applications.map((application) => (
            <li className="min-w-0" key={application.host}>
              <ApplicationCard application={application} />
            </li>
          ))}
        </ul>
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
            headingId="updates-heading"
            title="最新の更新"
          />
          <BlogPostBand posts={latestPosts} />
        </div>
      </section>
    </div>
  );
}
