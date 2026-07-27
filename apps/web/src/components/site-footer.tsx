import { ApiStatus } from "../features/api-health/components/api-status";

export function SiteFooter() {
  return (
    <footer className="mt-18 flex flex-col items-start justify-between gap-3 border-t pt-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center">
      <nav aria-label="関連リンク" className="flex flex-wrap gap-5">
        <a
          className="no-underline hover:text-primary"
          href="https://github.com/s-yoshiki"
          rel="noreferrer"
          target="_blank"
        >
          GitHub ↗
        </a>
        <a
          className="no-underline hover:text-primary"
          href="https://github.com/s-yoshiki/ex-foundry.com"
          rel="noreferrer"
          target="_blank"
        >
          このサイトのソース ↗
        </a>
      </nav>

      <span className="flex items-center gap-4">
        <ApiStatus />
        <span>© EX FOUNDRY</span>
      </span>
    </footer>
  );
}
