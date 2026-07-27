# Adding a feature

## 0. 雛形を生成する

```sh
pnpm create:feature <feature-name> [--app <app>]
```

`apps/<app>/src/features/<feature-name>/`に型・純粋関数・テスト・componentの
最小構成を生成します。生成物は出発点であり、そのまま使うものではありません。
既存ファイルは上書きしません。

以降の節は、生成物を実装へ育てるときの判断基準です。

## 1. 境界を決める

feature名は実装技術ではなく、ユーザーが認識できる機能で決めます。

```text
src/features/app-directory/
```

`utils`、`common`、`misc`のように責務が曖昧なfeature名は避けます。
CLIはこれらの名前を拒否します。

## 2. 必要なディレクトリだけ作る

```text
src/features/<feature>/
├── components/
├── hooks/
├── functions/
└── types/
```

例：

- 型だけなら`types/`
- 純粋関数、変換、API client、storage accessは`functions/`
- React stateが必要なら`hooks/`
- 表示は`components/`

空ディレクトリを作る必要はありません。

featureに属さないアプリ全体の骨組み（header、footer、ErrorBoundary）は
`src/components/`へ置きます。

## 3. 実装する

1. `types`へfeature固有型を置く
2. `functions`へ純粋関数や外部アクセスを置く
3. `hooks`でReact stateとlifecycleを接続する
4. `components`で表示を組み立てる
5. appのrouteまたはrootからfeature componentを利用する

componentを書く前に`@ex-foundry/ui`を確認します。
必要なプリミティブが無ければ、shadcn/uiから追加できます。

```sh
pnpm --filter @ex-foundry/ui ui:add dialog
```

外部と接する処理は、境界で検証します。

- APIレスポンス: `packages/api-contract`のスキーマで検証する
- Web Storage: 値の妥当性を確認し、アクセス失敗をcatchする
- 環境変数: 未設定を正常な状態として扱う

## 4. テストする

- functionsの分岐はunit test
- API、storage、security boundaryはintegration test
- UIは重要な状態（空、エラー、絞り込み結果0件）とアクセシビリティを確認
- 外部APIはCIから直接呼ばず、引数での差し替えかmockを使う

詳細は[テスト方針](testing.md)を参照してください。

## 5. 検証する

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

対象を絞る場合：

```sh
pnpm --filter @ex-foundry/web typecheck
pnpm --filter @ex-foundry/web test:watch
```

## Shared packageへ移す基準

次をすべて満たす場合に検討します。

- 2つ以上の利用側が存在する
- APIを小さく説明できる
- app固有のdomain logicを含まない
- 独立して型検査できる

将来使う可能性だけではshared packageへ移しません。

移す先の判断：

| 内容 | 移動先 |
| --- | --- |
| 汎用のUI primitive | `packages/ui` |
| デザイントークン | `packages/tailwind-config/theme.css` |
| APIのリクエスト・レスポンス定義 | `packages/api-contract` |
| リポジトリ運用のためのCLI | `scripts/<name>` |
