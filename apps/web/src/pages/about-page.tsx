import { AboutSection } from "../features/site-about/components/about-section";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function AboutPage() {
  useDocumentMeta(findRoute("about"));

  return <AboutSection />;
}
