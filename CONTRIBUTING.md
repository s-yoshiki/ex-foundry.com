# Contributing

## 開発フロー

1. `main`から作業ブランチを作成します。
2. `pnpm install`で依存関係を復元します。
3. 対象appまたはpackageを変更します。
4. 関連する検証を実行してPull Requestを作成します。

構成やツールチェーンを変える提案は、実装より先に
[設計判断記録](docs/decisions/README.md)を追加し、合意してから実装します。

## ディレクトリ

- `apps/web`: Vite + Reactの静的Webアプリ
- `apps/api`: Honoのローカルサーバー・Lambdaサンプル
- `packages/ui`: shadcn/uiベースの共有React UI
- `packages/api-contract`: apps間で共有するAPIスキーマとroute定義
- `packages/tailwind-config`: Tailwind CSS 4の共有テーマ
- `packages/typescript-config`: 共有TypeScript設定
- `scripts/create-feature`: featureの雛形生成CLI
- `scripts/infra`: AWS CDK（dev/prd）

フレームワーク固有コードは`apps/*`へ閉じ込めます。共有packageには複数の利用側で
必要なコードだけを置きます。

## よく使うコマンド

```sh
pnpm create:feature <feature-name>          # featureの雛形を生成
pnpm --filter @ex-foundry/ui ui:add <name>  # shadcn/uiのコンポーネントを追加
```

## 検証

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

開発中は対象を絞れます。

```sh
pnpm --filter @ex-foundry/web dev
pnpm --filter @ex-foundry/api dev
pnpm --filter @ex-foundry/api test:watch
```

## Pull Request

- 変更の目的、実施内容、検証方法を記載してください。
- UI変更ではPCとモバイル、ライトとダークの両テーマを確認してください。
- API変更ではテストを追加し、信頼境界を明確にしてください。
  リクエスト・レスポンスの変更は`packages/api-contract`から始めてください。
- 生成物、秘密情報、ローカル環境ファイルをコミットしないでください。
- 書式だけの大規模変更は機能変更と分離してください。
