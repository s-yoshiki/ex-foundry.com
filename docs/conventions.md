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

## app-level module

特定のfeatureに属さない横断的な実装は、`apps/*/src`直下に置きます。

- `src/hooks/`: 特定のdomainに紐付かない、app全体で使うhook
  （例: `usePageViewTracking`のようなapp shell向けの計測フック）。
- `src/libs/`: domainに依存しないユーティリティ関数・型。
  featureや外部SDKに依存しない、純粋な処理を置きます。

featureに固有のhook・utilityは、これまで通り`src/features/<feature>/{hooks,functions}`
に置きます。判断に迷ったら「特定のfeatureが無くなったらこの実装も不要になるか」で
決めます。不要にならない（例: analytics計測、日付フォーマット）なら`hooks`/`libs`側です。

## React

- componentは可能な限り宣言的に保ちます。
- 副作用はhookまたは境界へ集め、純粋な計算は`functions`へ移します。
- 表示のためのラベルや文言は、共有UIではなく利用側のfeatureが持ちます。
- アクセシブルなHTMLとキーボード操作を維持します。
  landmark（`header` / `main` / `footer`）、見出し階層、ラベルの関連付けを確認します。
- UI primitiveは`@repo/ui`を先に確認します。

## CSS

- Tailwind CSS 4のCSS-first configurationを使用します。
- スタイルはutility classで書き、独自のCSSクラスを増やしません。
- 共有tokenは`configs/tailwind-config/theme.css`へ追加します。
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
