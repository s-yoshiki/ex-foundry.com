import { ExternalLink, FileWarning, MessageSquareText, UserRound } from "lucide-react";
import { PageHero } from "../../../components/page-hero";
import { CONTACT_CHANNELS } from "../content";

const ICONS = [FileWarning, MessageSquareText, UserRound] as const;

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <PageHero
        description="記事や公開中のアプリケーションについて、誤りの報告、更新情報、改善案を受け付けています。静的サイトのため、GitHub Issuesを公開の連絡窓口として利用しています。"
        eyebrow="CONTACT"
        title="お問い合わせ"
        titleId="contact-heading"
      />

      <div className="mt-10 grid gap-4">
        {CONTACT_CHANNELS.map((channel, index) => {
          const Icon = ICONS[index];

          return (
            <article className="rounded-xl border bg-card p-5" key={channel.title}>
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold tracking-tight">{channel.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {channel.description}
                  </p>
                  <a
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    href={channel.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {channel.label}
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        連絡内容に個人情報や秘密情報を含めないでください。すべての問い合わせに返信できるとは限りませんが、確認した内容はサイトやアプリの改善に利用します。
      </p>
    </section>
  );
}
