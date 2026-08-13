import { ApiStatus } from "../features/api-health/components/api-status";
import { Link } from "../routing/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Link className="flex items-center gap-2.5 font-semibold no-underline" to="home">
            <span className="grid size-9 place-items-center rounded-lg bg-primary font-mono text-sm font-extrabold text-primary-foreground">
              EX
            </span>
            EX FOUNDRY
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            個人開発したWebアプリケーションと、技術の知見を公開しています。
          </p>
        </div>

        <nav aria-label="サイト" className="flex flex-col gap-2 text-sm">
          <p className="mb-1 font-semibold">サイト</p>
          <Link className="text-muted-foreground no-underline hover:text-foreground" to="home">
            プロダクト情報
          </Link>
          <Link className="text-muted-foreground no-underline hover:text-foreground" to="apps">
            アプリ一覧
          </Link>
          <Link className="text-muted-foreground no-underline hover:text-foreground" to="changelog">
            更新履歴
          </Link>
          <Link className="text-muted-foreground no-underline hover:text-foreground" to="about">
            このサイトについて
          </Link>
          <Link
            className="text-muted-foreground no-underline hover:text-foreground"
            to="editorialPolicy"
          >
            編集方針
          </Link>
          <Link className="text-muted-foreground no-underline hover:text-foreground" to="contact">
            お問い合わせ
          </Link>
          <a className="text-muted-foreground no-underline hover:text-foreground" href="/privacy/">
            プライバシー
          </a>
        </nav>

        <nav aria-label="外部リンク" className="flex flex-col gap-2 text-sm">
          <p className="mb-1 font-semibold">リンク</p>
          <a
            className="text-muted-foreground no-underline hover:text-foreground"
            href="https://github.com/s-yoshiki"
            rel="noreferrer"
            target="_blank"
          >
            GitHub ↗
          </a>
          <a
            className="text-muted-foreground no-underline hover:text-foreground"
            href="https://github.com/s-yoshiki/ex-foundry.com"
            rel="noreferrer"
            target="_blank"
          >
            このサイトのソース ↗
          </a>
        </nav>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground lg:items-end">
          <ApiStatus />
          <span>© EX FOUNDRY</span>
        </div>
      </div>
    </footer>
  );
}
