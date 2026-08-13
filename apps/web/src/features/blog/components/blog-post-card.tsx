import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "../types/blog-post";
import { BLOG_CONTENT_TYPE_LABELS, getBlogProductLabel } from "../types/blog-post";
import { AiGeneratedBadge } from "./ai-generated-badge";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex w-full gap-3.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25 hover:bg-muted/40">
      <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted text-xs font-bold text-muted-foreground">
        {post.coverImage ? (
          <img
            alt=""
            aria-hidden="true"
            className="size-full object-contain"
            src={post.coverImage}
          />
        ) : (
          "EX"
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <time dateTime={post.publishedOn}>{post.publishedOn}</time>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            {BLOG_CONTENT_TYPE_LABELS[post.contentType]}
          </span>
          {post.aiGenerated ? <AiGeneratedBadge /> : null}
          <ArrowUpRight
            aria-hidden="true"
            className="ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>

        <p className="mt-1 text-[11px] text-muted-foreground">
          {getBlogProductLabel(post.product)}
        </p>

        <h2 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug tracking-tight sm:text-[15px]">
          <a className="after:absolute after:inset-0" href={`${post.path}/`}>
            {post.title}
          </a>
        </h2>

        <ul aria-label="タグ" className="mt-2.5 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <li
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
