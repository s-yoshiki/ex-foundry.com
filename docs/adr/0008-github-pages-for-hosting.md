# ADR 0008: GitHub Pagesでホスティングする

- Status: Accepted
- Date: 2026-07-27

## 背景

ex-foundry.comは公開中のアプリケーション一覧を表示する静的サイトです。
サーバー側の処理はなく、コンテンツの更新頻度も高くありません。

## 決定

`apps/web`のビルド成果物をGitHub Pagesへ公開します。
独自ドメインは`apps/web/public/CNAME`で指定します。

## 理由

- ソースと同じ場所でホスティングとCI/CDが完結し、外部サービスの設定を持ちません。
- 静的サイトに必要な機能（独自ドメイン、HTTPS、CDN）が揃っています。
- 費用がかかりません。

## 検討した代替案

- **Cloudflare Pages / Vercel / Netlify**: プレビューデプロイなどの機能は上ですが、
  この規模では外部サービスの認証とsecret管理が増える分だけ不利です。
- **S3 + CloudFront**: 制御は最も細かくできますが、IaCの保守が必要になります。

## 結果

サーバーサイドの処理が必要になった場合は、`apps/api`をLambdaなどへ
別途デプロイし、Webからは`VITE_API_BASE_URL`経由で呼びます
（[0006](0006-shared-api-contract-package.md)）。
Web自体は静的のままにします。

SPAのクライアントサイドルーティングを導入する場合、
GitHub Pagesはfallbackを持たないため`404.html`での対応が必要です。
現状は単一ページのため、`404.html`は本来の404ページとして使っています。

プレビューデプロイが必要になったら、このADRを再検討します。
