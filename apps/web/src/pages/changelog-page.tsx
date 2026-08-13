import { ChangelogList } from "../features/blog/components/changelog-list";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function ChangelogPage() {
  useDocumentMeta(findRoute("changelog"));

  return <ChangelogList />;
}
