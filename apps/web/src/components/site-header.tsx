import { GitBranch, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BlogSearch } from "../features/blog/components/blog-search";
import { ThemeToggle } from "../features/theme/components/theme-toggle";
import { Link } from "../routing/link";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeMenu, menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-4">
          <Link
            aria-label="EX FOUNDRY トップ"
            className="flex shrink-0 items-center gap-2.5 no-underline"
            to="home"
          >
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-mono text-sm font-extrabold text-primary-foreground"
            >
              EX
            </span>
            <span className="text-sm font-semibold tracking-tight">EX FOUNDRY</span>
          </Link>

          <div className="mx-auto hidden w-full max-w-sm shrink md:block">
            <BlogSearch compact={true} />
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
            <SiteNav />
            <ThemeToggle />
            <a
              aria-label="GitHub"
              className="shrink-0 rounded-md p-2 text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
              href="https://github.com/s-yoshiki"
              rel="noreferrer"
              target="_blank"
            >
              <GitBranch aria-hidden="true" className="size-4" />
            </a>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              aria-controls={menuId}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
              className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={toggleMenu}
              ref={menuButtonRef}
              type="button"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-4" />
              ) : (
                <Menu aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="border-t py-3 md:hidden">
          <BlogSearch compact={true} />
        </div>

        <div
          className="absolute inset-x-4 top-full z-50 mt-2 rounded-xl border bg-popover p-2 shadow-lg sm:inset-x-6 md:hidden"
          hidden={!menuOpen}
          id={menuId}
        >
          <SiteNav
            ariaLabel="モバイルサイト内"
            className="flex-col items-stretch gap-1"
            linkClassName="rounded-lg px-3 py-2"
            onNavigate={closeMenu}
          />
          <a
            className="mt-2 flex items-center gap-2 border-t px-3 pt-3 text-sm text-muted-foreground no-underline hover:text-foreground"
            href="https://github.com/s-yoshiki"
            rel="noreferrer"
            target="_blank"
          >
            <GitBranch aria-hidden="true" className="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
