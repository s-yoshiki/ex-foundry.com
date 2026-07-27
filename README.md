# ex-foundry.com

EX FOUNDRYのポータルサイトであり、pnpm workspaces + Turborepo + TypeScriptを使った
小規模Webアプリケーション用テンプレートです。

## 技術スタック

- Node.js 26 / pnpm 11 / Turborepo
- TypeScript 7
- React 19 + Vite + React Router
- Tailwind CSS 4 + shadcn/ui
- Hono + zod
- Biome / Vitest
- AWS CDK
- GitHub Actions / GitHub Pages

## 構成

```text
.
├── apps/
│   ├── api/                    # Hono API（ローカルサーバー / Lambda）
│   └── web/                    # Vite + Reactの公開サイト
├── packages/
│   ├── api-contract/           # apps間で共有するAPIスキーマとroute定義
│   ├── tailwind-config/        # Tailwind CSS 4共有テーマ
│   ├── typescript-config/      # 共有TypeScript設定
│   └── ui/                     # shadcn/uiベースの共有React UI
├── scripts/
│   ├── create-feature/         # featureの雛形生成CLI
│   └── infra/                  # AWS CDK（dev/prd）
├── docs/                       # 設計・運用ドキュメントとADR
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
`GET /api/greeting/:name`を提供します。WebからAPIを呼ぶ場合は
`apps/web/.env`に`VITE_API_BASE_URL`を設定します（未設定ならAPIを呼びません）。

```sh
cp apps/web/.env.example apps/web/.env
```

## 共通コマンド

```sh
pnpm check          # Biomeでlintとformatを確認
pnpm check:fix      # 安全に修正できる項目を反映
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
```

featureの雛形を生成する場合：

```sh
pnpm create:feature <feature-name> [--app <app>]
```

UIコンポーネントを追加する場合：

```sh
pnpm --filter @ex-foundry/ui ui:add dialog
```

## ドキュメント

- [ドキュメント一覧](docs/README.md)
- [アーキテクチャ](docs/architecture.md)
- [実装規約](docs/conventions.md)
- [featureの追加方法](docs/adding-a-feature.md)
- [テスト方針](docs/testing.md)
- [ルーティング](docs/routing.md)
- [UIパッケージ](docs/ui.md)
- [APIコントラクト](docs/api-contract.md)
- [設定ファイル](docs/configuration.md)
- [デプロイと運用](docs/deployment.md)
- [インフラ](docs/infrastructure.md)
- [テンプレートとして使う](docs/template-usage.md)
- [設計判断記録（ADR）](docs/decisions/README.md)
- [コントリビューション](CONTRIBUTING.md)

## デプロイ

`main`へのpushで検証・ビルド後、`apps/web/dist`をGitHub Pagesへ公開します。
独自ドメインは`apps/web/public/CNAME`から成果物へコピーされます。
詳細は[デプロイと運用](docs/deployment.md)を参照してください。
