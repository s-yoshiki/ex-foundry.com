# Configuration

## Runtime

- `.node-version` / `.nvmrc`: Node.js 26
- `package.json#packageManager`: pnpmの固定バージョン
- `.npmrc`: engine、peer dependency、exact versionの制約

バージョン変更時は、指定ファイルとCIを同じPRで更新します。

## pnpm workspace

`pnpm-workspace.yaml`で`apps/*`、`configs/*`、`packages/*`、`scripts/*`を管理します。
install scriptを必要とする依存関係は`allowBuilds`へ明示し、追加理由をレビューします。

依存はexact versionで固定します（`.npmrc`の`save-exact`）。
`pnpm add`が範囲指定で書き込んだ場合は、固定値へ直します。

## Turborepo

`turbo.json`は次の共通taskを定義します。

| task | 内容 |
| --- | --- |
| `dev` | cacheなし、常駐 |
| `typecheck` | 依存packageから順に実行 |
| `test` | 依存packageのbuild後に実行 |
| `test:coverage` | `coverage/`を成果物として扱う |
| `test:watch` | cacheなし、常駐 |
| `build` | typecheck後に成果物を生成 |

新しいapp/packageは、必要な同名scriptを自身の`package.json`へ追加します。
scriptが無いworkspaceはそのtaskの実行対象から自動的に外れます。

## TypeScript

`configs/tsconfig`を`@repo/typescript-config`というworkspace packageとして管理し、
各workspaceから設定をextendsします。

- `base.json`: framework非依存のstrict設定
- `node.json`: Node.js、API、CLI
- `react-library.json`: React package
- `vite-react.json`: Vite + React app

各workspaceは`node_modules/.cache`へ`.tsbuildinfo`を生成し、Git管理しません。

TypeScript 7を使用しています。`baseUrl`のような非推奨オプションは使いません。
workspace間の参照はpnpmのworkspace依存で解決し、
project references（`references`）は使いません。
`noEmit`のworkspaceを参照できないためです。

## Vitest

各workspaceに`vitest.config.ts`を置きます。`apps/web`のみ`vite.config.ts`に統合しています。

- Node環境: `apps/api`、`packages/api-contract`、`scripts/*`
- DOM環境（happy-dom）: `apps/web`、`packages/ui`

`globals: false`のため、`describe` / `it` / `expect`は明示的にimportします。
setupファイルの役割は[テスト方針](testing.md)を参照してください。

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
- `check:fix`: 安全に修正できる項目を反映

実設定は`configs/biome/biome.json`に置き、ルート`biome.json`からextendsします。
ルートの薄い設定は、CLIとエディタがリポジトリルートから設定を探索するための
入口です。実設定は`root: false`として、ネストしたBiome projectとして扱われるのを
防ぎます。

generated directoryは実設定の`files.includes`で除外します。例外ルールは
全体で無効にせず、必要なpathへoverrideを設定します。

## Tailwind CSS

Tailwind CSS 4はJavaScript configではなくCSS-first configurationを使います。
共有テーマは`configs/tailwind-config`を`@repo/tailwind-config`というworkspace
packageとして管理します。

```css
@import "tailwindcss";
@import "@repo/tailwind-config/theme.css";
@source "../../../packages/ui/src";
```

Vite appでは`@tailwindcss/vite`をpluginとして登録します。共有UIのsourceを
`@source`で明示し、package側で使われたutility classも生成対象にします。

## shadcn/ui

`packages/ui/components.json`がCLIの設定です。
aliasはpath aliasではなくパッケージ名を指しており、
利用側にbundlerのalias設定を要求しません。詳細は[UIパッケージ](ui.md)を参照してください。

## EditorとGit

- `.editorconfig`: 改行、indent、末尾空白
- `.gitattributes`: LFとbinary file
- `.gitignore`: dependency、cache、build output

Editor固有設定を必須にせず、CLIとCIの結果を正とします。

## GitHub

- `.github/workflows/ci.yml`: Pull Requestの品質検証
- `.github/workflows/deploy.yml`: mainからGitHub Pagesへデプロイ
- `.github/dependabot.yml`: npmとGitHub Actionsの更新
- `.github/CODEOWNERS`: レビュー担当
- `.github/ISSUE_TEMPLATE`: bug、feature、refactor
- `.github/pull_request_template.md`: PRの説明と検証項目

workflowには最小権限を設定し、外部サービスのsecretをサンプル値でcommitしません。
