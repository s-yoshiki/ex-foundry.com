import { BLOG_CONTENT_CLASS } from "../features/blog/functions/blog-content-style";
import { findRoute } from "../routing/routes";
import { useDocumentMeta } from "../routing/use-document-meta";

export function PrivacyPage() {
  useDocumentMeta(findRoute("privacy"));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight">プライバシーポリシー</h1>
      <div className={`${BLOG_CONTENT_CLASS} mt-8`}>
        <h2>広告について</h2>
        <p>
          当サイトでは、Google
          AdSenseを利用して広告を配信する場合があります。Googleなどの第三者配信事業者は、Cookieを使用して、当サイトや他のサイトへの過去のアクセス情報に基づいた広告を配信することがあります。
        </p>
        <p>
          ユーザーはGoogleの<a href="https://www.google.com/settings/ads">広告設定</a>
          からパーソナライズド広告を無効にできます。また、
          <a href="https://www.aboutads.info/">www.aboutads.info</a>
          から第三者配信事業者によるCookieの使用を無効にできます。
        </p>
        <h2>アクセス解析について</h2>
        <p>
          当サイトでは、利用状況を把握するためGoogle
          Analyticsを利用しています。収集される情報には、アクセス日時、閲覧ページ、ブラウザやOSの情報などが含まれます。詳細は
          <a href="https://policies.google.com/privacy">Googleのプライバシーポリシー</a>
          をご確認ください。
        </p>
        <h2>お問い合わせ</h2>
        <p>
          運営者情報や連絡先については、
          <a href="https://github.com/s-yoshiki">GitHubプロフィール</a>をご確認ください。
        </p>
        <p className="text-sm text-muted-foreground">制定日: 2026-08-13</p>
      </div>
    </article>
  );
}
