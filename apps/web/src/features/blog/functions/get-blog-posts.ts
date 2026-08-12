import { BLOG_POSTS } from "virtual:ex-foundry-blog-content";
import type { BlogPost } from "../types/blog-post";

export function getBlogPosts(): readonly BlogPost[] {
  return BLOG_POSTS;
}

export function findBlogPost(id: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.id === id);
}

export function getBlogPostId(pathname: string): string | undefined {
  const match = pathname.match(/^\/entry\/(\d+)\/?$/);
  return match?.[1];
}
