import { Card, CardContent, CardHeader, CardTitle, TagList } from "@repo/ui";
import { useId } from "react";
import { PageHero } from "../../../components/page-hero";
import { Link } from "../../../routing/link";
import { getHighlights } from "../functions/get-highlights";

const STACK = [
  "TypeScript",
  "React 19",
  "Vite",
  "Hono",
  "Tailwind CSS 4",
  "shadcn/ui",
  "Turborepo",
  "pnpm",
  "Biome",
  "GitHub Actions",
] as const;

export function AboutSection() {
  const guidanceHeadingId = useId();
  const highlights = getHighlights();

  return (
    <section aria-labelledby="about-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHero
        description="EX FOUNDRYは、日々の作業で欲しくなった小さなWebアプリケーションを作って公開している個人プロジェクトです。すべてブラウザだけで動作し、ログインなしで利用できます。"
        eyebrow="ABOUT"
        title="EX FOUNDRYについて"
        titleId="about-heading"
      />

      <ul className="mt-10 mb-8 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 p-0">
        {highlights.map((highlight) => (
          <li key={highlight.title}>
            <Card className="h-full gap-3 py-5">
              <CardHeader className="px-5">
                <CardTitle className="text-base">{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 text-sm leading-relaxed text-muted-foreground">
                {highlight.body}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">このサイトの技術スタック</h3>
      <TagList items={STACK} label="このサイトの技術スタック" />

      <section aria-labelledby={guidanceHeadingId} className="mt-10 border-t pt-8">
        <h2 className="text-xl font-semibold tracking-tight" id={guidanceHeadingId}>
          運営方針とお問い合わせ
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          記事の作成・検証・更新の考え方や、内容の誤りを知らせる方法を公開しています。読者からの指摘をもとに、記事とアプリケーションを継続的に改善します。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="inline-flex rounded-full border px-4 py-2 text-sm font-medium no-underline transition-colors hover:bg-muted"
            to="editorialPolicy"
          >
            編集方針を見る
          </Link>
          <Link
            className="inline-flex rounded-full border px-4 py-2 text-sm font-medium no-underline transition-colors hover:bg-muted"
            to="contact"
          >
            お問い合わせ
          </Link>
        </div>
      </section>
    </section>
  );
}
