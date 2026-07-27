# UI package

`packages/ui`は[shadcn/ui](https://ui.shadcn.com/)を土台にした共有UIです。
shadcn/uiはnpmパッケージではなく、コンポーネントのソースをリポジトリへコピーする方式です。
生成されたコードは自分たちのコードとして扱い、必要に応じて直接編集します。

## 構成

```text
packages/ui/
├── components.json          # shadcn CLIの設定
├── src/
│   ├── components/ui/       # shadcn CLIが生成するプリミティブ
│   ├── lib/utils.ts         # cn()
│   ├── <name>.tsx           # ex-foundry向けに組み合わせたcomponent
│   └── index.ts             # 公開面
```

- `components/ui/`はCLIの再生成対象です。大きく手を入れる場合は、
  ラップするcomponentを`src/`直下に作る方を優先します。
- `src/`直下のcomponentは、プリミティブを組み合わせてアプリの語彙に合わせたものです。

## コンポーネントを追加する

```sh
pnpm --filter @ex-foundry/ui ui:add dialog
```

`components.json`のaliasはパッケージ名を指しています。

```json
{ "utils": "@ex-foundry/ui/lib/utils", "ui": "@ex-foundry/ui/components/ui" }
```

生成されたコードは`@ex-foundry/ui/lib/utils`のようにimportします。これはpackage.jsonの
`exports`によるself-referenceで解決されるため、利用側のappにbundlerのalias設定は不要です。
`@/`のようなpath aliasを使うと、利用側ごとに解決設定が必要になるため採用していません。

追加後は公開面を更新します。

```ts
// packages/ui/src/index.ts
export { Dialog, DialogContent } from "@ex-foundry/ui/components/ui/dialog";
```

## デザイントークン

トークンは`packages/tailwind-config/theme.css`に集約しています。
shadcn/uiの語彙（`--background`、`--primary`、`--muted-foreground`など）をそのまま使うため、
生成されたコンポーネントを無修正で利用できます。

テーマの切り替えはclassではなく`data-theme`属性で行います。

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

- ブランドのアクセントは`--primary`にマップします。
- app固有の色を共有テーマへ追加しません。
- `index.html`のbootstrap scriptが初回描画前に`data-theme`を確定させ、
  テーマのちらつきを防ぎます。

## スタイルの書き方

- スタイルはTailwindのutility classで書きます。独自のCSSクラスを増やしません。
- 条件付きのclassは`cn()`で合成します。後勝ちでTailwindのutilityが解決されます。
- 任意値（`text-[0.7rem]`）を増やす前に、既存のスケールを確認します。

## 依存の方向

- `packages/ui`はappをimportしません。
- 業務ロジック、API通信、feature固有の文言を置きません。
  ステータスバッジの「公開中」のような文言は、呼び出し側が渡します。
- 利用側が2つ以上になってから共有packageへ移します。

## テスト

プリミティブのラッパーは、アクセシビリティ上の契約をテストします。

```tsx
expect(screen.getByRole("radiogroup", { name: "テーマ" })).toBeInTheDocument();
```

Radixのroleは素のHTMLと異なることがあります（`ToggleGroup type="single"`は
`radiogroup`/`radio`）。テストは実際に描画されるroleに合わせます。
