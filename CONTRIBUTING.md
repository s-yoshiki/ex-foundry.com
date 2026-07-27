# Contributing

## 開発フロー

1. `main`から作業ブランチを作成します。
2. `pnpm install`で依存関係を復元します。
3. 対象appまたはpackageを変更します。
4. 関連する検証を実行してPull Requestを作成します。

## ディレクトリ

- `apps/web`: Vite + Reactの静的Webアプリ
- `apps/api`: Honoのローカルサーバー・Lambdaサンプル
- `packages/ui`: Webアプリ間で共有するReact UI
- `packages/tailwind-config`: Tailwind CSS 4の共有テーマ
- `packages/typescript-config`: 共有TypeScript設定
- `scripts/*`: IaCやリポジトリ固有CLI

フレームワーク固有コードは`apps/*`へ閉じ込めます。共有packageには複数の利用側で
必要なコードだけを置きます。

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
pnpm --filter @ex-foundry/api test
```

## Pull Request

- 変更の目的、実施内容、検証方法を記載してください。
- UI変更ではPCとモバイルを確認してください。
- API変更ではテストを追加し、信頼境界を明確にしてください。
- 生成物、秘密情報、ローカル環境ファイルをコミットしないでください。
- 書式だけの大規模変更は機能変更と分離してください。
