# ADR 0001: pnpm workspacesとTurborepoでmonorepoを構成する

- Status: Accepted
- Date: 2026-07-27

## 背景

ex-foundry配下には、独立して公開される小規模なWebアプリケーションが複数あります。
リポジトリを分けると、TypeScript設定・lint規約・CIの手順が各リポジトリで少しずつ
ずれていき、修正が横展開されなくなります。一方で、すべてを1つのアプリに詰め込むと
1か所の不具合が全体を止めます。

## 決定

pnpm workspacesでworkspaceを分割し、Turborepoでタスクを実行します。
`apps/*`をデプロイ単位、`packages/*`を共有ソース、`scripts/*`をIaCとCLIの置き場とします。

## 理由

- 共有したいのは「土台」であって「アプリ」ではありません。
  workspaceを分ければ、土台だけを共有しつつデプロイ単位は独立させられます。
- pnpmのisolated node_modulesは、宣言していない依存への暗黙のアクセスを防ぎます。
  依存の宣言漏れがローカルで通ってCIで落ちる、という事故を減らせます。
- Turborepoはタスクの依存関係（`build`は`typecheck`の後）とキャッシュを宣言的に書けます。
  ルートのコマンドを`pnpm test`のまま保ちつつ、実行対象を絞り込めます。

## 検討した代替案

- **リポジトリを分ける**: 独立性は最も高いものの、設定の同期コストが継続的に発生します。
  アプリ数が増えるほど不利になります。
- **npm/yarn workspaces**: 動作しますが、依存の隔離がpnpmより緩く、
  宣言漏れを検出できません。
- **Nx**: 機能は十分ですが、この規模には設定量が過剰です。

## 結果

新しいアプリの追加は、`apps/<name>`を作り既存のscript名を揃えるだけになります。
一方で、workspace間の依存方向を守る責任が生まれます（[0003](0003-feature-based-frontend-structure.md)、
[0006](0006-shared-api-contract-package.md)）。

アプリが1つだけになった場合は、この構成を維持する意味が薄れます。
その時点で再検討します。
