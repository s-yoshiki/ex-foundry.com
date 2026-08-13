import { EditorialPolicySection } from "../features/site-guidance/components/editorial-policy-section";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function EditorialPolicyPage() {
  useDocumentMeta(findRoute("editorialPolicy"));

  return <EditorialPolicySection />;
}
