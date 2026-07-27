import { PageShell } from "@ex-foundry/ui";
import { ApplicationList } from "./features/app-directory/components/application-list";

export function App() {
  return (
    <PageShell>
      <header className="intro">
        <span className="brand-mark" aria-hidden="true">
          EX
        </span>
        <p className="eyebrow">Turborepo sample application</p>
        <h1>EX FOUNDRY</h1>
        <p>ex-foundry.comで公開しているWebアプリケーションの一覧です。</p>
      </header>

      <ApplicationList />

      <footer className="site-footer">
        <a href="https://github.com/s-yoshiki" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <span>© EX FOUNDRY</span>
      </footer>
    </PageShell>
  );
}
