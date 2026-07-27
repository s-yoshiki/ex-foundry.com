# Conventions

ドキュメントは日本語、コードとコード内コメントは英語で書きます。

## 命名

- workspace package: `@<project>/<name>`
- feature directory: kebab-case
- React component: PascalCase
- component file: kebab-case `.tsx`
- hook: `use-<name>.ts`
- test: 対象ファイルの隣に`*.test.ts` / `*.test.tsx`
- environment variable: SCREAMING_SNAKE_CASE（Viteでは`VITE_`接頭辞）

## TypeScript

- `strict`を無効にしません。
- `any`より`unknown`と明示的なnarrowingを使います。
- 外部入力を信頼せず、API、storage、環境変数の境界で検証します。
- domain型はframework型から独立させます。
- 型だけのimportには`import type`を使います。
- packageの公開面は`exports`で明示します。
- 失敗しうる処理は、例外ではなく結果の型で表現することを検討します。

```ts
export type ApiResult<TData> =
  | { data: TData; status: "ok" }
  | { message: string; status: "error" };
```

## Feature

- routeやpageは画面合成と入出力の接続に限定します。
- 状態とlifecycleは`hooks`、純粋な導出処理は`functions`へ置きます。
- 再利用されない処理を早期にshared packageへ移しません。
- feature間の直接importが増えた場合は、共通packageまたはapp-level moduleを検討します。
- `src/features/<feature>`内の非公開実装をbarrel exportで広く公開しません。

## React

- componentは可能な限り宣言的に保ちます。
- 副作用はhookまたは境界へ集め、純粋な計算は`functions`へ移します。
- 表示のためのラベルや文言は、共有UIではなく利用側のfeatureが持ちます。
- アクセシブルなHTMLとキーボード操作を維持します。
  landmark（`header` / `main` / `footer`）、見出し階層、ラベルの関連付けを確認します。
- UI primitiveは`@ex-foundry/ui`を先に確認します。

## CSS

- Tailwind CSS 4のCSS-first configurationを使用します。
- スタイルはutility classで書き、独自のCSSクラスを増やしません。
- 共有tokenは`packages/tailwind-config/theme.css`へ追加します。
- app固有のtokenを共有テーマへ追加しません。
- 任意値（`text-[0.7rem]`）を増やす前に既存のスケールを再利用します。
- focus、contrast、responsive stateをライト・ダークの両方で確認します。

## API

- routeは薄く保ちます。
- リクエストとレスポンスの形は`packages/api-contract`で定義し、両側で共有します。
- 正常系だけでなく、不正入力と信頼境界をテストします。
- secret、network access、権限が必要な処理はWebへ置きません。
- health endpointを用意します。
- エラーへsecret、内部stack trace、拒否した入力そのものを含めません。

## テスト

- ランナーはVitestに統一します。
- 取得はrole・ラベル・テキストで行い、`data-testid`は最後の手段にします。
- 空状態、エラー状態、境界値を必ず含めます。
- 外部APIはCIから直接呼ばず、引数での差し替えかmockを使います。

詳細は[テスト方針](testing.md)を参照してください。

## Git

- 1つのPRへ無関係な変更を混ぜません。
- 大規模なformat変更は機能変更と分離します。
- generated file、secret、`.env`をコミットしません。
- commit前に関連するcheck、typecheck、test、buildを実行します。
- 構成レベルの判断を変える場合は、ADRを同じPRに含めます。
