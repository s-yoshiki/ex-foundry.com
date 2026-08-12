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
  contentPath: string;
};
