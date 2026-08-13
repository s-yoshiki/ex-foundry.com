/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: content is sanitized during the static build before it reaches the browser. */

import { useEffect, useState } from "react";
import { BLOG_CONTENT_CLASS } from "../functions/blog-content-style";

type ArticleContentProps = {
  path: string;
  /**
   * Pre-rendered body, supplied only by the SSR entry point so the static
   * build embeds the real article text instead of the loading placeholder.
   * The live client always fetches fresh and never passes this.
   */
  presetHtml?: string;
};

export function ArticleContent({ path, presetHtml }: ArticleContentProps) {
  const [html, setHtml] = useState<string | null>(presetHtml ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (presetHtml !== undefined) {
      return;
    }

    let active = true;

    setHtml(null);
    setFailed(false);

    fetch(path)
      .then((response) => {
        if (!response.ok) throw new Error(`Article content request failed: ${response.status}`);
        return response.text();
      })
      .then((value) => {
        if (active) setHtml(value);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [path, presetHtml]);

  if (failed) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center leading-relaxed text-muted-foreground">
        記事本文を読み込めませんでした。ページを再読み込みしてください。
      </p>
    );
  }

  if (html === null) {
    return <p className="text-muted-foreground">記事本文を読み込んでいます…</p>;
  }

  return (
    <div
      className={`${BLOG_CONTENT_CLASS} max-w-none`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
