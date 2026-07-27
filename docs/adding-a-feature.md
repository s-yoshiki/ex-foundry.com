# Adding a feature

## 1. 境界を決める

feature名は実装技術ではなく、ユーザーが認識できる機能で決めます。

```text
src/features/app-directory/
```

`utils`、`common`、`misc`のように責務が曖昧なfeature名は避けます。

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

## 3. 実装する

1. `types`へfeature固有型を置く
2. `functions`へ純粋関数や外部アクセスを置く
3. `hooks`でReact stateとlifecycleを接続する
4. `components`で表示を組み立てる
5. appのrouteまたはrootからfeature componentを利用する

## 4. テストする

- functionsの分岐はunit test
- API、storage、security boundaryはintegration test
- UIは重要な状態とアクセシビリティを確認
- 外部APIはCIから直接呼ばず、fixtureまたはmockを使う

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
pnpm --filter @ex-foundry/web build
```

## Shared packageへ移す基準

次をすべて満たす場合に検討します。

- 2つ以上の利用側が存在する
- APIを小さく説明できる
- app固有のdomain logicを含まない
- 独立して型検査できる

将来使う可能性だけではshared packageへ移しません。
