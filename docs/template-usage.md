# テンプレートとして使う

このリポジトリはEX FOUNDRYのポータルサイトであると同時に、
小規模Webアプリケーションを始めるための参照実装です。

## 含まれるもの

| 領域 | 内容 |
| --- | --- |
| workspace | pnpm workspaces + Turborepo（`apps` / `packages` / `scripts`） |
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

### 2. scopeを変更する

`@ex-foundry/*`を対象プロジェクトのscopeへ置き換えます。

```sh
grep -rl "@ex-foundry/" --include="*.json" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.md" . \
  | grep -v node_modules \
  | xargs sed -i '' 's|@ex-foundry/|@your-scope/|g'
```

置換後に`pnpm install`と`pnpm typecheck`を実行し、参照が壊れていないか確認します。

### 3. 不要なものを外す

- APIを使わない場合は`apps/api`と`packages/api-contract`を削除し、
  `apps/web`から`@ex-foundry/api-contract`依存と`features/api-health`を外します。
- Webを使わない場合は`apps/web`と`packages/ui`、`packages/tailwind-config`を削除します。
- 削除したworkspaceは、ルート`tsconfig.json`の`references`からも外します。

### 4. サイト固有の内容を差し替える

| 対象 | ファイル |
| --- | --- |
| メタデータ、OGP、テーマbootstrap | `apps/web/index.html` |
| ブランド色 | `packages/tailwind-config/theme.css` |
| 画面の構成 | `apps/web/src/app.tsx`、`apps/web/src/components/` |
| 公開ファイル | `apps/web/public/`（`CNAME`、`robots.txt`、`sitemap.xml`、`og.png`、`404.html`） |
| 構造化データ | `apps/web/plugins/structured-data.ts` |

`apps/web/src/features/app-directory`と`features/site-about`は、
このサイト固有のfeatureです。参考実装として読んだあとは置き換えます。

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
