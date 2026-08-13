import { ContactSection } from "../features/site-guidance/components/contact-section";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function ContactPage() {
  useDocumentMeta(findRoute("contact"));

  return <ContactSection />;
}
