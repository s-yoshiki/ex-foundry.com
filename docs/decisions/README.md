# 設計判断記録（ADR）

構成やツールチェーンの選択と、その理由を残す場所です。
「なぜこうなっているのか」が失われると、同じ議論を繰り返すか、
理由のわからないまま構成が壊れていきます。

## 一覧

| # | タイトル | 状態 |
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

## 書き方

1. `template.md`をコピーし、連番でファイルを作ります。
2. 決定を1つだけ書きます。複数の決定は別のADRに分けます。
3. 実装より先にADRを書き、レビューで合意してから実装します。

## 状態

- **Proposed**: 提案中。まだ実装していない。
- **Accepted**: 採用済み。現在の構成の根拠。
- **Superseded**: 後続のADRで置き換えられた。ファイルは削除せず、
  置き換え先へのリンクを追記する。

過去のADRは書き換えません。判断が変わったときは、新しいADRを追加して
古いものをSupersededにします。記録の目的は「今の正しさ」ではなく
「当時なぜそう判断したか」を残すことです。
