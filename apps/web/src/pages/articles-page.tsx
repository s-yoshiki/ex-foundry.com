import { ArticleList } from "../features/blog/components/article-list";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function ArticlesPage() {
  useDocumentMeta(findRoute("articles"));

  return <ArticleList />;
}
