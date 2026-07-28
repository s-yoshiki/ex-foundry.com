# Architecture

## 目的

このリポジトリは、ex-foundry配下の小規模Webプロジェクトを開始するための
参照実装です。すべてのプロジェクトを同じフレームワークに固定するのではなく、
リポジトリ構成、コマンド、品質基準、CI/CDの操作を揃えます。

判断の背景は[設計判断記録](decisions/README.md)にあります。

## Workspace構成

```text
.
├── apps/
│   ├── api/                    # Hono API
│   └── web/                    # Vite + Reactの公開サイト
├── configs/
│   ├── biome/                  # Biome共有設定
│   ├── tailwind-config/        # Tailwind CSS 4テーマ
│   └── tsconfig/               # TypeScript共有設定
├── packages/
│   ├── api-contract/           # APIスキーマとroute定義
│   └── ui/                     # shadcn/uiベースの共有UI
├── scripts/
│   ├── create-feature/         # featureの雛形生成CLI
│   └── infra/                  # AWS CDK（dev/prd）
└── docs/
```

## 依存方向

```text
apps/web ──▶ packages/ui ──▶ configs/tailwind-config
    │
    ├──────▶ packages/api-contract ◀────── apps/api
    │
    └──────▶ configs/tsconfig ◀───────────── apps/api
```

- `apps/*`はプロダクトを実行・デプロイする単位です。
- `configs/*`は共有ツール設定です。
- `packages/*`は単独ではデプロイしません。
- packageからappをimportしてはいけません。
- appからappをimportしてはいけません。共有したいものはpackageへ出します。
- UI packageへ業務ロジックやAPI通信を置いてはいけません。
- framework固有コードは対象appに閉じ込めます。

## Web app

### featureとapp-level

ユーザーに提供する機能は`src/features/`へ、アプリ全体の骨組みは`src/components/`へ置きます。

```text
apps/web/src/
├── components/        # skip link、header、footer、ErrorBoundaryなどの骨組み
├── features/          # ユーザーに提供する機能
├── app.tsx            # 画面の合成
└── main.tsx           # entrypoint
```

`src/components/`に置くのは、特定のfeatureに属さず、
かつ他のappで再利用する予定がないものだけです。
再利用するものは`packages/ui`へ、機能に属するものはfeature内へ置きます。

### feature内部

```text
src/features/<feature>/
├── components/        # feature固有Reactコンポーネント
├── hooks/             # feature固有React hooks
├── functions/         # 純粋関数、変換、取得処理
└── types/             # feature固有の型
```

すべてのディレクトリを先に作る必要はありません。ファイルが存在する責務だけを
作成します。`pnpm create:feature <name>`が最小構成の雛形を生成します。

依存は原則として次の向きにします。

```text
components ──▶ hooks ──▶ functions ──▶ types
components ──────────────────────────▶ types
```

`functions`は可能な限りReactに依存させず、単独でテストできる形にします。
API clientやstorage accessも、feature内で完結するものは`functions`へ配置します。

実装例：

| feature | 例示している内容 |
| --- | --- |
| `app-directory` | 一覧表示、絞り込み、純粋関数の分離 |
| `theme` | storage境界の検証、副作用のhookへの隔離 |
| `api-health` | 共有コントラクトを使った外部通信 |
| `site-about` | 表示のみのfeature |

### ビルド時の生成

`apps/web/plugins/`にVite pluginを置きます。
`structured-data.ts`はアプリケーション一覧からschema.orgのJSON-LDを生成し、
ビルド時に`index.html`へ埋め込みます。クライアントで描画しないため、
JavaScriptを実行しないクローラからも参照できます。

## Web routing

ルーターは`src/routing/adapters/`に閉じ込め、その外側は自前の
navigation portだけに依存します。詳細は[ルーティング](routing.md)を参照してください。

## API

APIはHonoを使用します。

- `app.ts`: route定義、共通のnotFound / errorハンドラ
- `local.ts`: Node.jsローカルサーバー
- `lambda.ts`: AWS Lambda entrypoint
- `*.test.ts`: routeとsecurity boundaryのテスト

外部入力はroute境界で検証します。検証には`packages/api-contract`のスキーマを使い、
サーバーとクライアントで同じ定義を共有します。

規模が大きくなった場合は、Webと同じくfeature単位へ分割し、
route handlerからdomain logicを分離します。

## Infrastructure

`scripts/infra`がAWS CDKでインフラを定義します。1つのAWSアカウントに
`dev`と`prd`を共存させ、分離はリソース命名で行います。
詳細は[インフラ](infrastructure.md)を参照してください。

## 共有するもの・しないもの

共有するもの：

- TypeScriptのstrict設定
- デザイントークンとUI primitive
- APIのリクエスト・レスポンス定義
- root command
- CIの検証順序

共有しないもの：

- ブランド固有の画面
- app固有のdomain logic
- deployment固有の秘密情報
- 1つのappでしか使わない抽象化
