# Deployment

## パイプライン

| workflow | 契機 | 内容 |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Pull Request、手動 | `pnpm verify` |
| `.github/workflows/deploy.yml` | `main`へのpush、手動 | `pnpm verify` の後、`apps/web/dist`をGitHub Pagesへ公開 |

deployはCIと同じ検証を再実行します。mainへ直接pushされた場合でも、
検証を通らない成果物が公開されないようにするためです。

## apps/web（GitHub Pages）

公開されるのは`apps/web/dist`のみです。`apps/web/public`配下は、
ビルド時にそのまま成果物へコピーされます。

| ファイル | 役割 |
| --- | --- |
| `CNAME` | 独自ドメイン（ex-foundry.com） |
| `.nojekyll` | GitHub PagesのJekyll処理を無効化 |
| `404.html` | 存在しないパスへのアクセス時に返すページ |
| `og.png` | OGP画像 |

`robots.txt`と`sitemap.xml`は`apps/web/public`には置かず、
`plugins/static-routes.ts`が`ROUTES`から`dist`へ生成します。

`404.html`はビルド成果物に依存しない自己完結したHTMLです。
アプリのCSSやJSが読み込めない状況でも表示できるよう、スタイルを内包しています。

### 構造化データ

schema.orgのJSON-LDは`apps/web/plugins/structured-data.ts`が
アプリケーション一覧から生成し、ビルド時に`index.html`へ埋め込みます。
クライアントで描画しないため、JavaScriptを実行しないクローラからも参照できます。

アプリを追加・変更したときは`get-applications.ts`だけを更新すれば、
カード表示と構造化データの両方に反映されます。

route別のtitle、description、canonical、OGP、sitemapと、SPA遷移時のGA4計測は
[SEO・OGP・Analytics](seo-ogp-analytics.md)を参照してください。

## apps/api（AWS Lambda）

`apps/api`はesbuildで`dist/index.mjs`へバンドルします。

```sh
pnpm --filter @repo/api build
```

- `src/lambda.ts`がLambdaのentrypoint（`handler`）です。
- `src/local.ts`はローカル実行用で、成果物には含まれません。
- 本リポジトリにデプロイworkflowは含めていません。
  IaCを追加する場合は`scripts/<name>`へ置きます。

## 確認

デプロイ後に確認する項目です。

- トップページがPCとモバイルで表示される
- ライト・ダークの両テーマで判読できる
- 存在しないパス（例: `/no-such-page`）で404ページが返る
- `view-source:`でJSON-LDが埋め込まれている
- `robots.txt`と`sitemap.xml`が200で返る
- `/`と`/about`のtitle、description、canonical、`og:url`がそれぞれ異なる
- `og.png`が200かつ画像の`Content-Type`で返る
- 初回表示とSPA遷移でGA4 `page_view`が1件ずつ送信される

ビルド成果物の確認コマンドと、二重計測・SNS cacheを含む切り分け方法は
[SEO・OGP・Analytics](seo-ogp-analytics.md)にまとめています。

## ロールバック

GitHub Pagesはビルド成果物を都度差し替えるため、
ロールバックは「正しかったコミットを再デプロイする」操作になります。

1. 問題のあるcommitを`git revert`する
2. `main`へpushし、deploy workflowの完了を待つ

緊急時は、正常だったcommitで`workflow_dispatch`からdeployを手動実行します。

## 権限とsecret

- workflowの`permissions`は最小限にします。
  deployのPages公開ジョブだけが`pages: write`と`id-token: write`を持ちます。
- secretはGitHubのEnvironment/Repository secretsで管理し、リポジトリへcommitしません。
- `.env.example`にはサンプル値のみを置きます。

## バージョン更新

Node.jsやpnpmのバージョンを変えるときは、次を同じPRで更新します。

- `.node-version` / `.nvmrc`
- `package.json#packageManager` / `engines`
- workflowが参照する設定（`node-version-file`）
