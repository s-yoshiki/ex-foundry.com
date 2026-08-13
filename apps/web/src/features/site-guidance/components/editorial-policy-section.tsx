import { BookOpenCheck, Bot, RefreshCcw, ShieldCheck } from "lucide-react";
import { PageHero } from "../../../components/page-hero";
import { BLOG_CONTENT_CLASS } from "../../blog/functions/blog-content-style";
import { EDITORIAL_POLICY_SECTIONS, EDITORIAL_POLICY_STEPS } from "../content";

const SECTION_ICONS = [BookOpenCheck, ShieldCheck, RefreshCcw, Bot, ShieldCheck] as const;

export function EditorialPolicySection() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHero
        description="EX FOUNDRYの記事をどのような目的で作成し、どのように更新・訂正しているかを説明します。"
        eyebrow="EDITORIAL POLICY"
        title="編集方針"
      />

      <section
        aria-labelledby="publication-process-heading"
        className="mt-10 rounded-xl border bg-card p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold tracking-tight" id="publication-process-heading">
          記事を公開するまで
        </h2>
        <ol className="mt-5 grid gap-4">
          {EDITORIAL_POLICY_STEPS.map((step, index) => (
            <li className="flex items-start gap-3" key={step}>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="pt-1 text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className={`${BLOG_CONTENT_CLASS} mt-10`}>
        {EDITORIAL_POLICY_SECTIONS.map((section, index) => {
          const Icon = SECTION_ICONS[index];

          return (
            <section aria-labelledby={`policy-${index}`} key={section.heading}>
              <h2 className="flex items-center gap-2" id={`policy-${index}`}>
                <Icon aria-hidden="true" className="size-5 text-primary" />
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          );
        })}
      </div>
    </article>
  );
}
