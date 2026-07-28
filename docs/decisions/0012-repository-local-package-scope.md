# 0012. リポジトリ内部packageのscopeを`@repo`に統一する

- 状態: Accepted
- 日付: 2026-07-28

## 背景

workspace packageは`@ex-foundry/*`というプロジェクト固有のscopeを
使用していました。一方、このリポジトリはEX FOUNDRYのポータルサイトであると
同時に、別プロジェクトへ複製して使う参照実装でもあります。

プロジェクト固有のscopeを使うと、テンプレート利用時にpackage定義、依存、
import、設定、ドキュメントを一括置換する必要があります。現在のworkspace
packageはすべてprivateであり、npmへ公開する名前としてのscopeは必要ありません。

## 決定

リポジトリ内部だけで使用するprivateなworkspace packageのscopeを
`@repo/*`に統一します。

## 理由

- テンプレートを複製したあともscopeを変更せずに利用できます。
- scopeが所有組織ではなく、リポジトリ内部の依存であることを示します。
- `apps`や`packages`といった物理配置をpackage名へ含めずに済みます。
- packageをworkspace内で移動してもimport名を維持できます。

## 検討した代替案

- **`@ex-foundry/*`を維持する**: 所有主体は明確ですが、テンプレート利用時に
  一括置換が必要です。
- **利用者ごとのscopeへ置き換える**: 外部公開するpackageには適していますが、
  privateなworkspaceだけを持つプロジェクトには追加作業となります。
- **`@repo/apps-*`と`@repo/packages-*`に分ける**: 配置は分かりますが、
  package名がディレクトリ構成に結合します。

## 結果

コード、設定、コマンド、現行ドキュメントでは`@repo/*`を使用します。
テンプレート利用時のscope置換手順は不要になります。

将来workspace packageをnpmへ公開する場合は、そのpackageだけを所有組織の
scopeへ変更し、公開名とリポジトリ内部名を一致させるか再検討します。
