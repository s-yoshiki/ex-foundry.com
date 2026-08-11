# ADR 0011: GA4のpage_viewをSPA側で手動送信する

- Status: Accepted
- Date: 2026-07-28

## 背景

`apps/web`にGoogle Analytics 4（測定ID`G-ECD2N4RTYS`）を導入することになりました。
標準のgtag.jsスニペットは`config`呼び出し時に自動で`page_view`を送信しますが、
このサイトはSPAで、`/about`のようなクライアント遷移はページの再読み込みを伴いません。
自動送信のままだと初回ロードの1回しか計測されず、遷移後のURLやtitleも
反映されません。

一方でこのサイトはGitHub Pages向けに[ADR 0008](0008-github-pages-for-hosting.md)で
ルートごとの静的HTMLも生成しており（`plugins/static-routes.ts`）、
直接アクセスやクローラはそちらを経由します。計測方式は、この2経路の両方と
[ADR 0009](0009-router-agnostic-routing-layer.md)のrouter-agnosticな構成に
矛盾しないものである必要がありました。

## 決定

`index.html`の`gtag`初期化で`send_page_view: false`を指定し、自動送信を止めます。
代わりに、特定のfeatureに属さないapp-level moduleとして手動送信します。

- `libs/analytics/track-page-view.ts`: `gtag`関数を引数で受け取る純粋関数
  （domain非依存のutilityとして`src/libs/`に置く）。
- `hooks/use-page-view-tracking.ts`: `NavigationPort`の`location`をキーに
  `useEffect`で発火するapp全体向けhook（`src/hooks/`に置く）。
- `app.tsx`のシェルで1回だけ呼び出し、個別のページ component は関与しない。

## 理由

- 初回ロードと遷移後の両方を同じ経路で計測でき、二重送信もURLの取りこぼしもない。
- `NavigationPort`（`location`のみ）に依存するため、`routing/adapters/`の
  ルーター実装を知らない。ADR 0009の境界（`routing-boundary.test.ts`）を壊さない。
- アプリシェルで1回フックするだけで、`routes.ts`にルートを追加しても
  自動的に計測対象になる。ページごとの実装漏れが起きない。
- `gtag`を引数として渡す設計により、`window.gtag`が未定義（読み込み前、
  広告ブロッカーなど）でも例外を投げず、ユニットテストでもモックで検証できる。
- `page_title`は`document.title`を都度読む。`useDocumentMeta`（ページ側の
  `useEffect`）がReactのコミット順序で子→親の順に先に走るため、
  シェル側の計測が走る時点では新しいルートのtitleに更新済みになる。

## 検討した代替案

- **自動`page_view`のまま**: 実装は最小だが、SPA遷移が一切計測できない。
  今回の主目的（ページ別のPV計測）を満たさない。
- **各ページの`useDocumentMeta`呼び出し箇所に計測を埋め込む**: ページ数が
  増えるたびに書き忘れが起きうる。シェルで1回フックする方が確実。
- **`routing/use-document-meta.ts`に計測を混ぜる**: routing層に
  analytics（featureの関心事）が漏れる。層の責務が曖昧になるため見送った。

## 結果

`page_view`の送信は`src/libs/analytics/`と`src/hooks/use-page-view-tracking.ts`に
閉じており、GA4以外の計測ツールに差し替える場合もこの2箇所と`index.html`の
スニペットだけが対象になる。analyticsはどのfeatureにも属さない横断的な関心事の
ため、featureディレクトリではなくapp-level moduleとして配置している。

引き受けたトレードオフとして、`window.gtag`はグローバルな`declare global`
（`libs/analytics/gtag.ts`）で型付けしている。他の計測イベント（クリックなど）
を送る場合も、同じ`gtag`注入パターンを`libs/analytics/`に追加する。
