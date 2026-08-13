import type { BlogPost } from "../types/blog-post";
import { BlogPostCard } from "./blog-post-card";

export function BlogPostBand({ posts }: { posts: readonly BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        記事がありません。
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.path} post={post} />
      ))}
    </div>
  );
}
