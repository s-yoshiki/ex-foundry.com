import { ErrorBoundary } from "../components/error-boundary";
import { ApplicationList } from "../features/app-directory/components/application-list";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function AppsPage() {
  useDocumentMeta(findRoute("apps"));

  return (
    <section aria-labelledby="apps-heading" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl" id="apps-heading">
        公開中のWebアプリケーション
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        開発や日々の作業で欲しくなった道具を、小さなWebアプリケーションとして公開しています。各アプリは登録なしで利用できます。
      </p>

      <ErrorBoundary
        fallback={
          <p className="mt-12 rounded-xl border border-dashed p-8 text-center leading-relaxed text-muted-foreground">
            アプリケーション一覧を表示できませんでした。ページを再読み込みしてください。
          </p>
        }
      >
        <div className="mt-12">
          <ApplicationList />
        </div>
      </ErrorBoundary>
    </section>
  );
}
