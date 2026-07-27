# Conventions

## 命名

- workspace package: `@<project>/<name>`
- feature directory: kebab-case
- React component: PascalCase
- component file: kebab-case `.tsx`
- hook: `use-<name>.ts`
- test: 対象ファイルの隣に`*.test.ts`
- environment variable: SCREAMING_SNAKE_CASE

## TypeScript

- `strict`を無効にしません。
- `any`より`unknown`と明示的なnarrowingを使います。
- 外部入力を信頼せず、APIやstorageの境界で検証します。
- domain型はframework型から独立させます。
- 型だけのimportには`import type`を使います。
- packageの公開面は`exports`で明示します。

## Feature

- routeやpageは画面合成と入出力の接続に限定します。
- 状態とlifecycleは`hooks`、純粋な導出処理は`functions`へ置きます。
- 再利用されない処理を早期にshared packageへ移しません。
- feature間の直接importが増えた場合は、共通packageまたはapp-level moduleを検討します。
- `src/features/<feature>`内の非公開実装をbarrel exportで広く公開しません。

## React

- componentは可能な限り宣言的に保ちます。
- 副作用はhookまたは境界へ集め、純粋な計算は`functions`へ移します。
- アクセシブルなHTMLとキーボード操作を維持します。
- UI primitiveは`@ex-foundry/ui`を先に確認します。

## API

- routeは薄く保ちます。
- 正常系だけでなく、不正入力と信頼境界をテストします。
- secret、network access、権限が必要な処理はWebへ置きません。
- health endpointを用意します。
- エラーへsecretや内部stack traceを含めません。

## CSS

- Tailwind CSS 4のCSS-first configurationを使用します。
- 共有tokenは`packages/tailwind-config/theme.css`へ追加します。
- app固有のtokenを共有テーマへ追加しません。
- 任意値を増やす前に既存tokenを再利用します。
- focus、contrast、responsive stateを確認します。

## Git

- 1つのPRへ無関係な変更を混ぜません。
- 大規模なformat変更は機能変更と分離します。
- generated file、secret、`.env`をコミットしません。
- commit前に関連するcheck、typecheck、test、buildを実行します。
