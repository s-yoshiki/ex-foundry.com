# Configuration

## Runtime

- `.node-version` / `.nvmrc`: Node.js 26
- `package.json#packageManager`: pnpmの固定バージョン
- `.npmrc`: engine、peer dependency、exact versionの制約

バージョン変更時は、指定ファイルとCIを同じPRで更新します。

## pnpm workspace

`pnpm-workspace.yaml`で`apps/*`、`packages/*`、`scripts/*`を管理します。
install scriptを必要とする依存関係は`allowBuilds`へ明示し、追加理由をレビューします。

## Turborepo

`turbo.json`は次の共通taskを定義します。

- `dev`: cacheなし、常駐
- `typecheck`: 依存packageから順に実行
- `test`: 依存packageのbuild後に実行
- `build`: typecheck後に成果物を生成

新しいapp/packageは、必要な同名scriptを自身の`package.json`へ追加します。

## TypeScript

`packages/typescript-config`の設定をextendsします。

- `base.json`: framework非依存のstrict設定
- `node.json`: Node.js、API、CLI
- `react-library.json`: React package
- `vite-react.json`: Vite + React app

各workspaceは`node_modules/.cache`へ`.tsbuildinfo`を生成し、Git管理しません。

## Biome

BiomeをFormatterとLinterの唯一の基盤として使います。ESLintとPrettierを重ねて
同じ責務を持たせません。

```sh
pnpm lint
pnpm format:check
pnpm check
pnpm check:fix
```

- `lint`: lintのみ
- `format:check`: format差分のみ
- `check`: lintとformatをまとめて確認
- `check:fix`:安全に修正できる項目を反映

generated directoryは`biome.json`で除外します。例外ルールは全体で無効にせず、
必要なpathへoverrideを設定します。

## Tailwind CSS

Tailwind CSS 4はJavaScript configではなくCSS-first configurationを使います。

```css
@import "tailwindcss";
@import "@ex-foundry/tailwind-config/theme.css";
@source "../../../packages/ui/src";
```

Vite appでは`@tailwindcss/vite`をpluginとして登録します。共有UIのsourceを
明示し、package側で使われたutility classも生成対象にします。

## EditorとGit

- `.editorconfig`: 改行、indent、末尾空白
- `.gitattributes`: LFとbinary file
- `.gitignore`: dependency、cache、build output

Editor固有設定を必須にせず、CLIとCIの結果を正とします。

## GitHub

- `.github/workflows/ci.yml`: Pull Requestの品質検証
- `.github/workflows/deploy.yml`: mainからGitHub Pagesへデプロイ
- `.github/dependabot.yml`: npmとGitHub Actionsの更新
- `.github/ISSUE_TEMPLATE`: bug、feature、refactor
- `.github/pull_request_template.md`: PRの説明と検証項目

workflowには最小権限を設定し、外部サービスのsecretをサンプル値でcommitしません。
