# ADR 0013: 共有ツール設定を`configs/*`に配置する

- Status: Accepted
- Date: 2026-07-28

## 背景

共通TypeScript設定とTailwindテーマは`packages/*`にあり、Biome設定はルートの
`biome.json`にすべて記述していました。`packages/*`は共有ソースの置き場でも
あるため、実行時コードとツール設定の分類が曖昧になります。

一方、BiomeやTypeScriptにはルートから探索・参照される入口が必要です。
設定本体を移すだけでは、CLIやエディタの標準的な探索を妨げる可能性があります。

## 決定

共有ツール設定を`configs/*`に配置し、ツールがルートから利用する薄い入口は
リポジトリルートに残します。

## 理由

- `packages/*`を共有ソース、`configs/*`を共有ツール設定として区別できます。
- TypeScript設定はworkspace packageとして依存関係を明示したまま移動できます。
- Tailwindテーマもpackage名を維持し、設定として分類できます。
- ルートの薄い設定を残すことで、CLIとエディタの設定探索を維持できます。
- 今後ツール設定が増えても、同じ分類規則で追加できます。

## 検討した代替案

- **現在の配置を維持する**: ファイル数は少ないものの、共有ソースと共有設定が
  `packages/*`に混在します。
- **ルート設定を完全に削除する**: 設定パスを各CLIとエディタへ明示する必要があり、
  標準コマンドが複雑になります。
- **すべてをworkspace packageにする**: Biome設定は現在1リポジトリからしか
  利用しないため、package化の利点がありません。

## 結果

`configs/tsconfig`は`@repo/typescript-config`、`configs/tailwind-config`は
`@repo/tailwind-config`という名前を維持したworkspace packageとします。
利用側のextends、import、依存名は変わりません。

Biomeの実設定は`configs/biome/biome.json`へ置き、ルート`biome.json`から
extendsします。実設定は`root: false`とし、Biome projectのrootはリポジトリ
ルートだけにします。ルート`tsconfig.json`もリポジトリ全体の入口として維持します。
