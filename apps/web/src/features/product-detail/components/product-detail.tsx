import { Badge } from "@repo/ui";
import { ArrowUpRight } from "lucide-react";
import { Link } from "../../../routing/link";
import { CATEGORY_ICONS } from "../../app-directory/functions/application-icons";
import { STATUS_LABELS } from "../../app-directory/functions/application-labels";
import type { Application, ApplicationCategory } from "../../app-directory/types/application";
import { BlogPostBand } from "../../blog/components/blog-post-band";
import type { Product } from "../types/product";

function ProductMark({ category }: { category: ApplicationCategory }) {
  const Icon = CATEGORY_ICONS[category];

  return (
    <span
      aria-hidden="true"
      className="grid size-14 shrink-0 place-items-center rounded-xl border border-border bg-primary/10 text-primary"
    >
      <Icon className="size-6" />
    </span>
  );
}

function ExternalCta({ application }: { application: Application }) {
  return (
    <a
      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground no-underline transition-opacity hover:opacity-90"
      href={`https://${application.host}/`}
      rel="noreferrer"
      target="_blank"
    >
      アプリを開く
      <ArrowUpRight aria-hidden="true" className="size-4" />
    </a>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const { application, groups, posts } = product;

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="パンくずリスト" className="mb-6">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li>
                <Link className="no-underline hover:text-foreground" to="apps">
                  アプリ一覧
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="truncate">
                {application.name}
              </li>
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            <ProductMark category={application.category} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                  {application.name}
                </h1>
                <Badge variant={application.status === "active" ? "default" : "secondary"}>
                  {STATUS_LABELS[application.status]}
                </Badge>
              </div>
              <p className="mt-2 font-mono text-sm text-primary">{application.host}</p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            {application.description}
          </p>

          <ul aria-label="技術スタック" className="mt-5 flex flex-wrap gap-2">
            {application.stack.map((tech) => (
              <li
                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                key={tech}
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <ExternalCta application={application} />
            <Link
              className="inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium no-underline transition-colors hover:bg-muted"
              search={`?product=${application.slug}`}
              to="articles"
            >
              関連記事をすべて見る（{posts.length}件）
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {groups.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            まだこのプロダクトに関する記事がありません。
          </p>
        ) : (
          <div className="grid gap-12">
            {groups.map((group) => (
              <section aria-labelledby={`product-${group.type}`} key={group.type}>
                <h2
                  className="mb-5 text-xl font-semibold tracking-tight"
                  id={`product-${group.type}`}
                >
                  {group.label}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {group.posts.length}件
                  </span>
                </h2>
                <BlogPostBand posts={group.posts} />
              </section>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
