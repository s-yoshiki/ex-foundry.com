import { BlogHome } from "../features/blog/components/blog-home";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function HomePage() {
  useDocumentMeta(findRoute("home"));

  return <BlogHome />;
}
