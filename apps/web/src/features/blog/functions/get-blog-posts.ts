import { BLOG_POPULAR_POST_PATHS, BLOG_POSTS } from "virtual:ex-foundry-blog-content";
import type { BlogPost } from "../types/blog-post";

export function getBlogPosts(): readonly BlogPost[] {
  return BLOG_POSTS;
}

export type BlogTagCount = {
  name: string;
  count: number;
};

export type BlogArchiveMonth = {
  month: string;
  count: number;
};

export type BlogArchiveYear = {
  year: string;
  count: number;
  months: readonly BlogArchiveMonth[];
};

export function getPopularBlogPosts(): readonly BlogPost[] {
  const postsByPath = new Map(BLOG_POSTS.map((post) => [post.path, post]));

  return BLOG_POPULAR_POST_PATHS.flatMap((path) => {
    const post = postsByPath.get(path);
    return post ? [post] : [];
  });
}

export function getRecommendedBlogPosts(current: BlogPost, limit = 6): readonly BlogPost[] {
  const currentTags = new Set(current.tags);

  return BLOG_POSTS.filter((post) => post.path !== current.path)
    .map((post) => ({
      post,
      score: post.tags.reduce(
        (total: number, tag: string) => total + (currentTags.has(tag) ? 1 : 0),
        0,
      ),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getBlogTagCounts(): readonly BlogTagCount[] {
  const counts = new Map<string, number>();

  for (const post of BLOG_POSTS) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ count, name }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "ja"));
}

export function getBlogArchive(): readonly BlogArchiveYear[] {
  const years = new Map<string, Map<string, number>>();

  for (const post of BLOG_POSTS) {
    const year = post.publishedOn.slice(0, 4);
    const month = post.publishedOn.slice(5, 7);

    if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month)) continue;

    const months = years.get(year) ?? new Map<string, number>();
    months.set(month, (months.get(month) ?? 0) + 1);
    years.set(year, months);
  }

  return [...years.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([year, months]) => ({
      count: [...months.values()].reduce((total, count) => total + count, 0),
      months: [...months.entries()]
        .sort(([left], [right]) => right.localeCompare(left))
        .map(([month, count]) => ({ count, month })),
      year,
    }));
}

export function findBlogPost(id: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.id === id);
}

export function getBlogPostId(pathname: string): string | undefined {
  const match = pathname.match(/^\/entry\/(\d+)\/?$/);
  return match?.[1];
}
