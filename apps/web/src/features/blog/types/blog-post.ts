export type BlogContentType = "product" | "architecture" | "release" | "operations";

export const BLOG_CONTENT_TYPE_LABELS: Record<BlogContentType, string> = {
  architecture: "技術構成",
  operations: "運用",
  product: "プロダクト",
  release: "リリース",
};

export const BLOG_PRODUCT_LABELS: Record<string, string> = {
  "ex-foundry": "EX FOUNDRY",
  devtoys: "DevToys Web",
  maker: "ひまつぶし研究室",
  npb: "NPB Analysis",
  kusoge: "クソゲーの森",
};

export function getBlogProductLabel(product: string): string {
  return BLOG_PRODUCT_LABELS[product] ?? product;
}

export type BlogPost = {
  id: string;
  title: string;
  path: string;
  date: string;
  publishedOn: string;
  coverImage: string;
  author: string;
  description: string;
  tags: readonly string[];
  aiGenerated: boolean;
  contentType: BlogContentType;
  contentPath: string;
  product: string;
  readingMinutes: number;
  toc: readonly { id: string; label: string }[];
};
