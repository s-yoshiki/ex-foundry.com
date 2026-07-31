# Documentation

## 読む順序

1. [アーキテクチャ](architecture.md) — workspace構成と依存方向
2. [実装規約](conventions.md) — 命名、TypeScript、React、API、CSS
3. [featureの追加方法](adding-a-feature.md) — 実装の進め方
4. [テスト方針](testing.md) — 何を、どの層でテストするか
5. [ルーティング](routing.md) — ルーター非依存の構成と移行手順
6. [SEO・OGP・Analytics](seo-ogp-analytics.md) — メタデータ、SNS共有、GA4の運用
7. [UIパッケージ](ui.md) — shadcn/uiの使い方と拡張手順
8. [APIコントラクト](api-contract.md) — apps/apiとapps/webのインタフェース共有
9. [設定ファイル](configuration.md) — ツールチェーンの設定
10. [デプロイと運用](deployment.md) — CI/CD、公開、ロールバック
11. [インフラ](infrastructure.md) — CDKによるdev/prd構成
12. [テンプレートとして使う](template-usage.md) — 新規プロジェクトの立ち上げ

## 設計判断

過去の技術選定とその理由は [設計判断記録（ADR）](decisions/README.md) にあります。
「なぜこの構成なのか」を変更する提案は、ADRを追加してから実装します。

## 書き方

- ドキュメントは日本語、コードとコード内コメントは英語で書きます。
- 実装と乖離したドキュメントは削除するか、同じPRで更新します。
- 手順を書く場合は、コピー&ペーストで実行できるコマンドを添えます。
