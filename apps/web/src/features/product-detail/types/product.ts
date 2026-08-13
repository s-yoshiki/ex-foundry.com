import type { Application } from "../../app-directory/types/application";
import type { BlogContentType, BlogPost } from "../../blog/types/blog-post";

export type ProductGroup = {
  label: string;
  posts: readonly BlogPost[];
  type: BlogContentType;
};

export type Product = {
  application: Application;
  groups: readonly ProductGroup[];
  posts: readonly BlogPost[];
};
