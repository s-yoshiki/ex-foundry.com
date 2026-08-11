# SEO・OGP・Analytics

`apps/web`はReactのSPAとして動作しますが、検索クローラやSNSのリンクプレビューは
JavaScriptを実行しない場合があります。そのため、ルートごとのメタデータを
**ビルド時の静的HTML**へ含め、クライアント遷移後は同じ値をDOMへ同期します。

このドキュメントは、SEO、OGP、GA4の実装場所、変更手順、検証方法をまとめた
運用ガイドです。設計判断の背景は
[ADR 0008](adr/0008-github-pages-for-hosting.md)、
[ADR 0009](adr/0009-router-agnostic-routing-layer.md)、
[ADR 0011](adr/0011-ga4-spa-page-view-tracking.md)を参照してください。

## 全体像

```text
src/routing/routes.ts
  ├── React Router                   # 画面ルーティング
  ├── plugins/static-routes.ts       # route別HTML、sitemap、robots
  ├── plugins/structured-data.ts     # JSON-LD
  ├── routing/use-document-meta.ts   # SPA遷移後の<head>同期
  └── hooks/use-page-view-tracking.ts
        └── GA4 page_view
```

### 情報の正

| 情報 | 正となるファイル | 生成・利用先 |
| --- | --- | --- |
| サイトURL・サイト名 | `src/routing/routes.ts` | canonical、sitemap、JSON-LD |
| routeのtitle・description | `src/routing/routes.ts` | 静的HTML、SPA遷移後の`<head>`、GA4 |
| 共通OGP・X Card | `index.html` | 全routeの静的HTML |
| route別OGP | `plugins/static-routes.ts` | `dist/**/index.html` |
| OGP画像 | `public/og.png` | `dist/og.png` |
| 公開アプリ一覧 | `features/app-directory/functions/get-applications.ts` | 画面、JSON-LD `ItemList` |
| GA4測定IDとbootstrap | `index.html` | 全routeの静的HTML |
| SPAの`page_view` | `hooks/use-page-view-tracking.ts` | 初回表示、クライアント遷移 |

値を別ファイルへ重複して追加せず、この表の正を更新します。

## SEO

### 静的HTMLとクライアント遷移

`plugins/static-routes.ts`は`ROUTES`を読み、ビルド時に次を生成します。

```text
dist/index.html
dist/about/index.html
dist/sitemap.xml
dist/robots.txt
```

各HTMLには、そのroute固有の次の値が含まれます。

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- `og:title`、`og:description`、`og:url`
- `twitter:title`、`twitter:description`

直接アクセスとクローラには静的HTMLが返ります。SPA内で遷移した後は
`useDocumentMeta`が同じ`ROUTES`の値へ`document.title`と`<head>`を更新します。
検索インデックスに使われる値は、クライアント側の更新ではなく静的HTMLを正として
確認してください。

### canonical URL

canonical URLは`canonicalUrl()`が生成します。

- トップページは`https://ex-foundry.com/`
- `/about`は`https://ex-foundry.com/about`
- query stringとfragmentはcanonicalへ含めない
- sitemapへ載せるURLとcanonicalを一致させる

絞り込みやトラッキング用query stringが付いたURLを、別ページとして
インデックスさせないためです。URL設計を変える場合は、旧URLからのredirectも
ホスティング側で検討します。

### sitemapとrobots

`sitemap.xml`と`robots.txt`は`public/`の手書きファイルではなく、
`static-routes.ts`がビルドごとに生成します。

- sitemapには`ROUTES`の全URLを絶対URLで出力する
- robotsはクロールを許可し、sitemapの絶対URLを示す
- 検索結果へ出したくないURLをsitemapへ追加しない
- robotsでブロックすることと`noindex`は別の制御として扱う

routeを追加しても、`ROUTES`へ登録すればsitemapへ自動で反映されます。

### 構造化データ

`plugins/structured-data.ts`はJSON-LDをビルド時に`<head>`へ挿入します。

| 型 | 用途 | 入力 |
| --- | --- | --- |
| `WebSite` | サイト名、正規URL、言語 | `SITE_NAME`、`SITE_URL` |
| `SiteNavigationElement` | 主要route | `ROUTES` |
| `ItemList` | 公開アプリ一覧 | `getApplications()` |
| `WebApplication` | 各アプリの名前・説明・URL | application定義 |

JSON-LDはクライアントで後から挿入せず、生成HTMLに含めます。アプリカードと
構造化データの内容を一致させるため、公開アプリの情報は`getApplications()`側だけを
更新します。

### 404

未知のURLへ直接アクセスした場合は`public/404.html`がHTTP 404で返り、
`<meta name="robots" content="noindex">`を持ちます。

SPA内で未知のURLへ遷移した場合は`NotFoundPage`を表示します。クライアント表示だけを
見てSEOを判断せず、公開環境へ直接リクエストしたときのstatusとHTMLを確認します。

### route追加時のチェックリスト

1. `src/routing/routes.ts`へtitle、description、path、navLabelを追加する
2. route componentから`useDocumentMeta(findRoute("<id>"))`を呼ぶ
3. `pnpm --filter @repo/web build`を実行する
4. 対応する`dist/<path>/index.html`が存在することを確認する
5. title、description、canonical、OGPがroute固有の値になっていることを確認する
6. `dist/sitemap.xml`へcanonical URLが1件だけ追加されていることを確認する
7. JSON-LDへ追加すべきnavigationやapplication情報が反映されていることを確認する

## OGP・X Card

### 現在の方針

全routeで共通の`public/og.png`を使います。画像は1200×630pxです。
`index.html`に次の共通情報を置きます。

- `og:type`、`og:locale`、`og:site_name`
- `og:image`、`og:image:width`、`og:image:height`
- `twitter:card`、`twitter:image`

routeごとに変わるtitle、description、URLは`static-routes.ts`が静的HTMLを生成するときに
置換します。SPA遷移後は`useDocumentMeta`もtitle、description、URLを同期します。

SNSクローラは通常、SPA内の遷移を操作しません。共有URLへ直接アクセスして得られる
静的HTMLに正しいタグがあることが重要です。

### OGP画像を変更する

1. `public/og.png`を1200×630pxのPNGとして差し替える
2. ファイルサイズと文字の可読性をPC・モバイル相当の縮小表示で確認する
3. ファイル名や形式を変える場合は、`index.html`の`og:image`と
   `twitter:image`を絶対URLで更新する
4. `pnpm --filter @repo/web build`後、`dist/og.png`と各routeのメタタグを確認する
5. デプロイ後、公開URLが200かつ正しい`Content-Type`で返ることを確認する

SNS側でプレビューがcacheされることがあります。タグを修正しても古い画像が出る場合は、
まず公開HTMLと画像URLを確認し、その後に各サービスの再取得手段を使います。

### route別画像へ拡張する場合

route定義へOGP画像URLを追加し、次の3か所を同時に変更します。

1. `static-routes.ts`で`og:image`と`twitter:image`を置換する
2. `useDocumentMeta`でSPA遷移後のDOMも同期する
3. route pluginのテストで、別routeの画像URLが混ざらないことを確認する

静的HTMLだけ、またはクライアントDOMだけを変更すると表示経路によって値がずれます。

## Google Analytics 4

### 計測方式

測定IDは`index.html`の`G-ECD2N4RTYS`です。Google tagの`config`では
`send_page_view: false`を指定し、自動送信を止めています。

```text
初回HTML
  └── gtag bootstrap（自動page_viewなし）
        └── React mount
              └── usePageViewTracking
                    └── 手動page_view

SPA遷移
  ├── useDocumentMetaでtitle更新
  └── usePageViewTrackingで手動page_view
```

初回表示もクライアント遷移も同じ手動経路で計測します。送信値は次のとおりです。

| parameter | 値 |
| --- | --- |
| `page_title` | route更新後の`document.title` |
| `page_location` | origin + pathname + search |

query stringは含め、fragmentは含めません。広告ブロッカーなどで`window.gtag`が
存在しない場合は例外を投げず、計測だけをスキップします。

### 二重計測を防ぐ

手動送信を維持する間は、次の両方を確認します。

- `index.html`の`send_page_view: false`を削除しない
- GA4 Webデータストリームの拡張計測機能で、ブラウザ履歴に基づく
  「ページの変更」計測を同時に有効化しない

自動履歴計測と`usePageViewTracking`を併用すると、SPA遷移時に`page_view`が
二重送信される可能性があります。方式を変更する場合は
[ADR 0011](adr/0011-ga4-spa-page-view-tracking.md)を置き換える新しいADRを作成します。

### 測定IDを変更する

`index.html`には測定IDが2か所あります。

1. `gtag/js?id=<MEASUREMENT_ID>`のscript URL
2. `gtag("config", "<MEASUREMENT_ID>", ...)`

両方を同じ値へ変更します。リポジトリをテンプレートとして複製した場合、
元サイトの測定IDを残したままデプロイしないでください。

測定IDはsecretではありません。ただし、利用目的、Cookie、同意取得、外部送信の表示は
公開地域とサービス要件に合わせて別途判断します。同意が必要な場合は、同意前にタグを
読み込まない設計またはConsent Modeを検討します。

### Analyticsの検証

1. 拡張機能の影響を避けたブラウザで公開サイトを開く
2. DevToolsのNetworkで`google-analytics.com/g/collect`または
   `analytics.google.com/g/collect`を絞り込む
3. 初回表示で`page_view`が1件だけ送られることを確認する
4. `/`から`/about`へクライアント遷移し、追加の`page_view`が1件だけ送られることを確認する
5. payloadの`page_location`と`page_title`が遷移後のrouteと一致することを確認する
6. GA4 DebugViewまたはRealtimeでイベントを確認する

標準レポートへの反映には時間がかかります。実装直後の確認にはNetwork、DebugView、
Realtimeを使います。開発時のReact Strict Modeはeffectを再実行するため、ローカル開発の
イベント数を本番値として評価しません。

## ビルド後の検証

```sh
pnpm --filter @repo/web test
pnpm --filter @repo/web build

rg '<title>|name="description"|rel="canonical"|property="og:|name="twitter:' \
  apps/web/dist/index.html \
  apps/web/dist/about/index.html

rg '"@type":"WebSite"|"@type":"WebApplication"' apps/web/dist/index.html
rg '<loc>' apps/web/dist/sitemap.xml
cat apps/web/dist/robots.txt
```

最低限、次を確認します。

- routeごとにtitle、description、canonical、`og:url`が一致する
- OGP・X Cardの画像URLがHTTPSの絶対URLである
- JSON-LDがJSONとしてparseできる
- sitemapがcanonical URLだけを含む
- robotsが公開sitemapを指す
- 404 HTMLが`noindex`を持つ

## デプロイ後の確認

```sh
curl -I https://ex-foundry.com/
curl -I https://ex-foundry.com/about
curl -I https://ex-foundry.com/og.png
curl -I https://ex-foundry.com/sitemap.xml
curl -I https://ex-foundry.com/robots.txt
curl -I https://ex-foundry.com/no-such-page
```

| 症状 | 主な確認箇所 |
| --- | --- |
| 検索結果のtitleが古い | 公開HTML、canonical、Search Consoleの再クロール状態 |
| `/about`がトップと同じdescription | `ROUTES`、`static-routes.ts`、`dist/about/index.html` |
| SNSでトップのタイトルになる | 共有URLへ直接アクセスした静的HTML、SNS側cache |
| OGP画像が出ない | 画像URLのstatus、Content-Type、ファイルサイズ、HTTPS |
| PVが遷移後に増えない | `usePageViewTracking`、Network、広告ブロッカー |
| PVが2件ずつ増える | `send_page_view`、GA4拡張計測の履歴イベント |
| GA4のtitleが1つ前のroute | `useDocumentMeta`と計測hookの実行順、送信payload |

## 参考資料

- [Google Search Central: canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google Search Central: sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Open Graph protocol](https://ogp.me/)
- [Google Analytics: page_view](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google Analytics: SPAの計測](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)
- [Google Analytics: 設定の検証とトラブルシューティング](https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot)
