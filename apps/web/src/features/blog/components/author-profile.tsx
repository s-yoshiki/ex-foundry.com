import { ExternalLink, GitBranch } from "lucide-react";

export function AuthorProfile() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary font-mono text-lg font-extrabold text-primary-foreground">
          EX
        </div>
        <div>
          <p className="font-semibold">s-yoshiki</p>
          <p className="mt-1 text-sm text-muted-foreground">
            個人開発と技術の記録を公開しています。
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs no-underline transition-colors hover:bg-muted"
          href="https://github.com/s-yoshiki"
          rel="noreferrer"
          target="_blank"
        >
          <GitBranch aria-hidden="true" className="size-3.5" />
          GitHub
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>
        <a
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs no-underline transition-colors hover:bg-muted"
          href="https://github.com/s-yoshiki/ex-foundry.com"
          rel="noreferrer"
          target="_blank"
        >
          ソースコード
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>
      </div>
    </div>
  );
}
