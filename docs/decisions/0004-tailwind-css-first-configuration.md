# 0004. Tailwind CSS 4のCSS-first configurationを使う

- 状態: Accepted
- 日付: 2026-07-27

## 背景

Tailwind CSS 3までは`tailwind.config.js`でテーマを定義していました。
Tailwind CSS 4では`@theme`によるCSS内での定義が標準になり、
JavaScript configは互換のために残されている位置づけです。

## 決定

`@theme`によるCSS-first configurationを使い、
共有トークンは`packages/tailwind-config/theme.css`に集約します。
JavaScriptのconfigファイルは持ちません。

## 理由

- デザイントークンがCSSカスタムプロパティとして出力されるため、
  Tailwindのutility以外（素のCSS、インラインstyle、`404.html`）からも同じ値を参照できます。
- ランタイムでのテーマ切り替えが、カスタムプロパティの上書きだけで実現できます。
  JavaScript configでは、ビルド時に確定した値しか持てません。
- 設定がCSSに閉じるため、ビルドツールごとの読み込み設定が不要になります。

## 検討した代替案

- **JavaScript config**: Tailwind 3からの移行コストは低いものの、
  4では非推奨方向であり、ランタイムのテーマ切り替えと相性が悪いです。
- **CSS Modules / 独自CSS**: トークンの一貫性を人手で守る必要があります。

## 結果

トークンの追加先は`packages/tailwind-config/theme.css`の1か所に定まります。
app固有の色をここへ追加しないことが、共有テーマを保つ条件になります。

共有UIのソースはappの外にあるため、
利用側で`@source`を宣言してTailwindの走査対象に含める必要があります。

```css
@source "../../../packages/ui/src";
```
