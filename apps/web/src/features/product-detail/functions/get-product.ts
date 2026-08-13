import { getApplications } from "../../app-directory/functions/get-applications";
import { getBlogPosts } from "../../blog/functions/get-blog-posts";
import { BLOG_CONTENT_TYPE_LABELS, type BlogContentType } from "../../blog/types/blog-post";
import type { Product } from "../types/product";

/** Display order on the product page; unrelated to the alphabetical label map. */
const CONTENT_TYPE_ORDER: readonly BlogContentType[] = [
  "product",
  "architecture",
  "release",
  "operations",
];

export function getProduct(slug: string): Product | undefined {
  const application = getApplications().find((candidate) => candidate.slug === slug);
  if (!application) return undefined;

  const posts = getBlogPosts().filter((post) => post.product === slug);
  const groups = CONTENT_TYPE_ORDER.map((type) => ({
    label: BLOG_CONTENT_TYPE_LABELS[type],
    posts: posts.filter((post) => post.contentType === type),
    type,
  })).filter((group) => group.posts.length > 0);

  return { application, groups, posts };
}

/** Matches `/products/<slug>` (with or without a trailing slash). */
export function getProductSlug(pathname: string): string | undefined {
  const match = pathname.match(/^\/products\/([^/]+)\/?$/);
  return match?.[1];
}
