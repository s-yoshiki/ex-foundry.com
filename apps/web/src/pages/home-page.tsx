import { ErrorBoundary } from "../components/error-boundary";
import { ApplicationList } from "../features/app-directory/components/application-list";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function HomePage() {
  useDocumentMeta(findRoute("home"));

  return (
    <ErrorBoundary
      fallback={
        <p className="rounded-xl border border-dashed p-8 text-center leading-relaxed text-muted-foreground">
          アプリケーション一覧を表示できませんでした。ページを再読み込みしてください。
        </p>
      }
    >
      <ApplicationList />
    </ErrorBoundary>
  );
}
