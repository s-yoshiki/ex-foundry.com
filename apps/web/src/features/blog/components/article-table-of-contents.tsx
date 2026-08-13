import { useEffect, useState } from "react";

type TableOfContentsItem = {
  id: string;
  label: string;
};

export function ArticleTableOfContents({
  items,
  variant = "sidebar",
}: {
  items: readonly TableOfContentsItem[];
  variant?: "inline" | "sidebar";
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver === "undefined") return;

    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  if (variant === "inline") {
    return (
      <nav
        aria-label="記事内目次"
        className="mb-10 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      >
        <h2 className="mb-4 text-lg font-bold tracking-tight">目次</h2>
        <ol className="grid gap-1 sm:grid-cols-2 sm:gap-x-8">
          {items.map((item) => (
            <li key={item.id}>
              <a
                aria-current={active === item.id ? "location" : undefined}
                className={
                  active === item.id
                    ? "block rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground no-underline"
                    : "block rounded-md px-3 py-2 text-sm text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
                }
                href={`#${item.id}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="サイドバー目次"
        className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
      >
        <h2 className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          目次
        </h2>
        <ol className="space-y-px border-l border-border text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                aria-current={active === item.id ? "location" : undefined}
                className={
                  active === item.id
                    ? "-ml-px block border-l-2 border-primary py-1.5 pl-3 font-medium text-primary no-underline"
                    : "-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-muted-foreground no-underline transition-colors hover:border-border hover:text-foreground"
                }
                href={`#${item.id}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
