# ADR 0007: テストランナーをVitestに統一する

- Status: Accepted
- Date: 2026-07-27

## 背景

`apps/api`はNode.js組み込みの`node:test`を使っていました。依存が増えず、
Lambdaへデプロイするコードがテストフレームワークに結合しない利点があります。
一方でブラウザ環境が必要な`apps/web`と`packages/ui`では利用できません。

ランナーが2つあると、実行方法・アサーションの書き方・カバレッジの取り方が
workspaceごとに変わり、テンプレートとして説明する内容が倍になります。

## 決定

全workspaceでVitestを使います。`node:test`は使いません。

## 理由

- テンプレートの価値は「どのworkspaceでも同じ手順で書ける」ことにあります。
  ランナーの統一はその中心です。
- Viteの設定（解決、TypeScript変換、エイリアス）をそのまま再利用できます。
- `vi.fn()` / `vi.stubGlobal()`のようなモック機能が標準で揃っており、
  外部依存の差し替えを別ライブラリなしに書けます。
- カバレッジの設定と出力形式が全workspaceで揃います。

## 検討した代替案

- **node:test（Node環境）+ Vitest（DOM環境）**: 依存は減りますが、
  ランナーの使い分けルールを覚える必要があります。
- **全workspaceでnode:test**: DOM環境のテストが書けません。

## 結果

Node専用のworkspace（`apps/api`、`packages/api-contract`、`scripts/*`）にも
devDependencyとしてVitestが入ります。実行時の成果物には含まれません。

Vitestはwindowのプロパティを固定リストでglobalへ複製するため、
`localStorage`のように一覧にないAPIはテスト環境に存在しません。
必要なものはsetupファイルで補います（`apps/web/src/test-setup.ts`）。
