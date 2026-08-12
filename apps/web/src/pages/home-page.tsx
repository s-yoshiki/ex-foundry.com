import { ErrorBoundary } from "../components/error-boundary";
import { ApplicationList } from "../features/app-directory/components/application-list";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function HomePage() {
  useDocumentMeta(findRoute("home"));

  return (
    <>
      <section aria-labelledby="home-heading">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl" id="home-heading">
          公開中のWebアプリケーション
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          開発や日々の作業で欲しくなった道具を、小さなWebアプリケーションとして公開しています。各アプリは登録なしで利用できます。
        </p>
      </section>
      <ErrorBoundary
        fallback={
          <p className="rounded-xl border border-dashed p-8 text-center leading-relaxed text-muted-foreground">
            アプリケーション一覧を表示できませんでした。ページを再読み込みしてください。
          </p>
        }
      >
        <ApplicationList />
      </ErrorBoundary>
    </>
  );
}
