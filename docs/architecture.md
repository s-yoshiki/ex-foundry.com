# Architecture

## 目的

このリポジトリは、ex-foundry配下の小規模Webプロジェクトを開始するための
参照実装です。すべてのプロジェクトを同じフレームワークに固定するのではなく、
リポジトリ構成、コマンド、品質基準、CI/CDの操作を揃えます。

## Workspace構成

```text
.
├── apps/
│   ├── api/                    # Hono APIサンプル
│   └── web/                    # Vite + Reactサンプル
├── packages/
│   ├── tailwind-config/        # Tailwind CSS 4テーマ
│   ├── typescript-config/      # TypeScript共通設定
│   └── ui/                     # React共通UI
├── scripts/                    # IaC、parser、リポジトリ固有CLI
└── docs/
```

## 依存方向

```text
apps/web ──▶ packages/ui ──▶ packages/tailwind-config
    │
    └──────▶ packages/typescript-config

apps/api ──▶ packages/typescript-config
```

- `apps/*`はプロダクトを実行・デプロイする単位です。
- `packages/*`は単独ではデプロイしません。
- packageからappをimportしてはいけません。
- UI packageへ業務ロジックやAPI通信を置いてはいけません。
- framework固有コードは対象appに閉じ込めます。

## Web feature

Webアプリは技術種別ではなく、ユーザーに提供する機能単位で分割します。

```text
src/features/<feature>/
├── components/        # feature固有Reactコンポーネント
├── hooks/             # feature固有React hooks
├── functions/         # 純粋関数、変換、取得処理
└── types/             # feature固有の型
```

すべてのディレクトリを先に作る必要はありません。ファイルが存在する責務だけを
作成します。小さいfeatureはフラットに開始し、責務が分かれた時点で移動できます。

依存は原則として次の向きにします。

```text
components ──▶ hooks ──▶ functions ──▶ types
components ──────────────────────────▶ types
```

`functions`は可能な限りReactに依存させず、単独でテストできる形にします。
API clientやstorage accessも、feature内で完結するものは`functions`へ配置します。
規模が大きくなった場合のみ、用途が明確なサブディレクトリへ分割します。

実装例は
`apps/web/src/features/app-directory`を参照してください。

## API

サンプルAPIはHonoを使用します。

- `app.ts`: route定義とHono app
- `local.ts`: Node.jsローカルサーバー
- `lambda.ts`: AWS Lambda entrypoint
- `*.test.ts`: routeとsecurity boundaryのテスト

規模が大きくなった場合は、Webと同じくfeature単位へ分割し、route handlerから
domain logicを分離します。外部入力はroute境界で検証します。

## 共有するもの・しないもの

共有するもの：

- TypeScriptのstrict設定
- Tailwind tokenの名前
- 汎用UI primitive
- root command
- CIの検証順序

共有しないもの：

- ブランド固有の画面
- app固有のdomain logic
- deployment固有の秘密情報
- 1つのappでしか使わない抽象化
