import { Link } from "../routing/link";
import { useDocumentTitle } from "../routing/use-document-meta";

/**
 * Shown when client-side navigation lands on an unknown path. A direct visit is
 * served the static `public/404.html` with a real 404 status instead, so the
 * canonical link is deliberately left pointing at the previous route.
 */
export function NotFoundPage() {
  useDocumentTitle("ページが見つかりません - EX FOUNDRY");

  return (
    <section aria-labelledby="not-found-heading" className="py-10 text-center">
      <p className="font-mono text-sm tracking-[0.14em] text-primary">404 NOT FOUND</p>

      <h1 className="mt-3 mb-4 text-2xl font-bold tracking-tight" id="not-found-heading">
        ページが見つかりません
      </h1>

      <p className="mx-auto mb-7 max-w-[420px] leading-loose text-muted-foreground">
        お探しのページは移動または削除された可能性があります。
        公開中のアプリケーションはトップページから確認できます。
      </p>

      <Link
        className="inline-block rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground no-underline"
        to="home"
      >
        トップページへ戻る
      </Link>
    </section>
  );
}
