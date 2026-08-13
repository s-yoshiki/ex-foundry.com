import { GitBranch } from "lucide-react";
import { BlogSearch } from "../features/blog/components/blog-search";
import { ThemeToggle } from "../features/theme/components/theme-toggle";
import { Link } from "../routing/link";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          aria-label="EX FOUNDRY トップ"
          className="flex shrink-0 items-center gap-2.5 no-underline"
          to="home"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-primary font-mono text-sm font-extrabold text-primary-foreground"
          >
            EX
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">EX FOUNDRY</span>
        </Link>

        <div className="mx-auto hidden w-full max-w-sm md:block">
          <BlogSearch compact />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <SiteNav />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <a
            aria-label="GitHub"
            className="rounded-md p-2 text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
            href="https://github.com/s-yoshiki"
            rel="noreferrer"
            target="_blank"
          >
            <GitBranch aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
      <div className="border-t px-4 py-3 md:hidden sm:px-6">
        <BlogSearch compact />
      </div>
    </header>
  );
}
