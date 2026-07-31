# テンプレートとして使う

このリポジトリはEX FOUNDRYのポータルサイトであると同時に、
小規模Webアプリケーションを始めるための参照実装です。

## 含まれるもの

| 領域 | 内容 |
| --- | --- |
| workspace | pnpm workspaces + Turborepo（`apps` / `configs` / `packages` / `scripts`） |
| 言語 | TypeScript 7（strict、共有tsconfig） |
| Web | React 19 + Vite + Tailwind CSS 4 + shadcn/ui |
| API | Hono（ローカルサーバーとLambda entrypoint） |
| 共有 | UIプリミティブ、デザイントークン、APIコントラクト |
| 品質 | Biome、Vitest、GitHub Actions |
| 生成 | featureのscaffold CLI |

## 立ち上げ手順

### 1. 複製して依存を入れる

```sh
corepack enable
pnpm install
pnpm dev
```

### 2. package名を確認する

privateなworkspace packageは`@repo/*`に統一しているため、
複製後にscopeを置き換える必要はありません。

npmへ公開するpackageがある場合だけ、対象packageを所有組織のscopeへ変更します。
その場合はpackage定義、利用側の依存、importを合わせて更新してください。

### 3. 不要なものを外す

- APIを使わない場合は`apps/api`と`packages/api-contract`を削除し、
  `apps/web`から`@repo/api-contract`依存と`features/api-health`を外します。
- Webを使わない場合は`apps/web`と`packages/ui`、`configs/tailwind-config`を削除します。
- 削除したworkspaceは、ルート`tsconfig.json`の`references`からも外します。

### 4. サイト固有の内容を差し替える

| 対象 | ファイル |
| --- | --- |
| 共通メタデータ、OGP、GA4、テーマbootstrap | `apps/web/index.html` |
| サイトURL、サイト名、route別title・description | `apps/web/src/routing/routes.ts` |
| ブランド色 | `configs/tailwind-config/theme.css` |
| 画面の構成 | `apps/web/src/app.tsx`、`apps/web/src/components/` |
| 公開ファイル | `apps/web/public/`（`CNAME`、`og.png`、`404.html`） |
| 静的HTML、robots、sitemap生成 | `apps/web/plugins/static-routes.ts` |
| 構造化データ | `apps/web/plugins/structured-data.ts` |

`apps/web/src/features/app-directory`と`features/site-about`は、
このサイト固有のfeatureです。参考実装として読んだあとは置き換えます。

複製後は、元サイトのdomain、ブランド名、OGP画像、GA4測定IDを残さないよう
[SEO・OGP・Analytics](seo-ogp-analytics.md)の「情報の正」と検証手順に従って
差し替えてください。

### 5. デプロイ先を合わせる

`.github/workflows/deploy.yml`はGitHub Pages向けです。
別のホスティングを使う場合は、buildジョブの成果物の扱いを差し替えます。
CI（`ci.yml`）はそのまま使えます。

## 最初のfeatureを作る

```sh
pnpm create:feature <feature-name>
```

`apps/web/src/features/<feature-name>/`に型・純粋関数・テスト・componentの
雛形が生成されます。生成物はそのまま使うものではなく、出発点です。
詳細は[featureの追加方法](adding-a-feature.md)を参照してください。

## 設計方針を引き継ぐ

このテンプレートの前提は[設計判断記録](decisions/README.md)に残しています。
構成を変える提案をするときは、該当ADRを読んでから、新しいADRを追加します。

引き継ぐと運用が楽になる方針です。

- フレームワーク固有コードは`apps/*`に閉じ込める
- 共有packageは利用側が2つ以上になってから作る
- 外部入力（API、storage、環境変数）は境界で検証する
- FormatterとLinterを二重に持たない
- ルートのコマンド（`check` / `typecheck` / `test` / `build`）を変えない
