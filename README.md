# ex-foundry.com

EX FOUNDRYのポータルサイトであり、pnpm workspaces + Turborepo + TypeScriptを使った
小規模Webアプリケーション用テンプレートです。

## 技術スタック

- Node.js 26
- pnpm 11
- Turborepo
- TypeScript
- React 19
- Vite
- Hono
- Tailwind CSS 4
- Biome
- GitHub Pages

## 構成

```text
.
├── apps/
│   ├── api/                    # Hono APIサンプル
│   └── web/                    # Vite + Reactのサンプルアプリ
├── packages/
│   ├── tailwind-config/        # Tailwind CSS 4共有テーマ
│   ├── typescript-config/      # 共有TypeScript設定
│   └── ui/                     # 共有React UI
├── scripts/                    # CLIやIaCを追加する場所
├── biome.json
├── pnpm-workspace.yaml
└── turbo.json
```

## セットアップ

```sh
corepack enable
pnpm install
pnpm dev
```

WebとAPIを個別に起動する場合：

```sh
pnpm --filter @ex-foundry/web dev
pnpm --filter @ex-foundry/api dev
```

APIは`http://localhost:3001`で起動し、`GET /health`と
`GET /api/greeting/:name`を提供します。

## 共通コマンド

```sh
pnpm check
pnpm check:fix
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

## テンプレートとして使う

1. `apps/web`を対象プロダクトのアプリへ置き換える
2. 再利用するUIを`packages/ui`へ置く
3. Node.jsのCLIやCDKは`scripts/<name>`へ追加する
4. package名を対象プロジェクトのscopeへ変更する
5. `.github/workflows/deploy.yml`をデプロイ先に合わせて変更する

フレームワーク固有コードは`apps/*`に閉じ込め、共有packageはReactやViteなどの
アプリケーション実装へ依存させすぎない方針です。

## ドキュメント

- [アーキテクチャ](docs/architecture.md)
- [実装規約](docs/conventions.md)
- [設定ファイル](docs/configuration.md)
- [featureの追加方法](docs/adding-a-feature.md)
- [コントリビューション](CONTRIBUTING.md)

## デプロイ

`main`へのpushで検証・ビルド後、`apps/web/dist`をGitHub Pagesへ公開します。
独自ドメインは`apps/web/public/CNAME`から成果物へコピーされます。
