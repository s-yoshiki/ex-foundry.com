# Architecture Decision Records

このディレクトリに、リポジトリの技術的な判断と決定事項を集約します。過去の判断も同じ形式で保持し、現在の状態を一覧から確認できるようにします。

- ファイル名は NNNN-kebab-case.md とし、番号は連番にする。
- 各ADRは Status と Date を持ち、状態は Proposed、Accepted、Superseded、Deprecated のいずれかにする。
- 既存の判断を変更するときは元のADRを書き換えず、新しいADRを追加して Supersedes を記録する。
- 新しい判断は実装と同じPRで追加し、コード・workflow・ドキュメントの変更理由を残す。
- PRとActionsの検証入口はルートの pnpm verify とする。

| ID | Decision | Status |
| --- | --- | --- |
| [0001](0001-monorepo-with-pnpm-and-turborepo.md) | pnpm workspacesとTurborepoでmonorepoを構成する | Accepted |
| [0002](0002-biome-as-single-toolchain.md) | FormatterとLinterをBiomeに一本化する | Accepted |
| [0003](0003-feature-based-frontend-structure.md) | フロントエンドをfeature単位で分割する | Accepted |
| [0004](0004-tailwind-css-first-configuration.md) | Tailwind CSS 4のCSS-first configurationを使う | Accepted |
| [0005](0005-shadcn-ui-for-shared-components.md) | 共有UIをshadcn/uiベースで構築する | Accepted |
| [0006](0006-shared-api-contract-package.md) | APIインタフェースを専用packageで共有する | Accepted |
| [0007](0007-vitest-as-single-test-runner.md) | テストランナーをVitestに統一する | Accepted |
| [0008](0008-github-pages-for-hosting.md) | GitHub Pagesでホスティングする | Accepted |
| [0009](0009-router-agnostic-routing-layer.md) | ルーターを差し替え可能な層に閉じ込める | Accepted |
| [0010](0010-single-account-multi-environment-cdk.md) | 1つのAWSアカウントに命名で複数環境を共存させる | Accepted |
| [0011](0011-ga4-spa-page-view-tracking.md) | GA4のpage_viewをSPA側で手動送信する | Accepted |
| [0012](0012-repository-local-package-scope.md) | リポジトリ内部packageのscopeを`@repo`に統一する | Accepted |
| [0013](0013-shared-tool-configuration-directory.md) | 共有ツール設定を`configs/*`に配置する | Accepted |
| [0014](0014-repository-conventions.md) | ex-foundry リポジトリ規約 | Accepted |
| [0015](0015-static-blog-content.md) | ブログ記事をビルド時に静的HTMLとして公開する | Accepted |
| [0016](0016-blog-ui-migration.md) | 技術ブログのUIと情報設計をex-foundryへ統合する | Accepted |
| [0017](0017-editorial-guidance-pages.md) | 編集方針とお問い合わせを公開ページとして提供する | Accepted |
| [0018](0018-product-information-site.md) | EX FOUNDRYをプロダクト情報サイトとして再構成する | Accepted |
| [0019](0019-article-examples-and-diagrams.md) | 記事に実装例と構成図を含める | Accepted |
| [0020](0020-biome-strict-rule-preset.md) | Biomeの適用可能なルールを厳格化する | Accepted |

テンプレート: [template.md](template.md)
