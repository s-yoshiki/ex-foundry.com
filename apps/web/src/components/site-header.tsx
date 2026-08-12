import { ThemeToggle } from "../features/theme/components/theme-toggle";
import { Link } from "../routing/link";
import { SiteNav } from "./site-nav";

export function SiteHeader() {
  return (
    <header className="mb-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link aria-label="EX FOUNDRY トップ" className="no-underline" to="home">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-xl bg-primary font-mono text-lg font-extrabold text-primary-foreground"
          >
            EX
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <SiteNav />
          <ThemeToggle />
        </div>
      </div>

      <p className="mb-2 font-mono text-xs tracking-[0.08em] text-primary uppercase">
        Web applications by ex-foundry
      </p>

      <p className="text-[clamp(2.4rem,8vw,4.8rem)] leading-none font-bold tracking-[-0.06em]">
        EX FOUNDRY
      </p>

      <p className="mt-5 max-w-[620px] leading-relaxed text-muted-foreground">
        個人開発したWebアプリケーションと、設計・実装・運用で得た知見を公開しています。アプリはすべて無料で、登録なしに利用できます。
      </p>
    </header>
  );
}
