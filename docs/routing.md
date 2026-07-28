# Routing

`apps/web`はReact Routerで動作しますが、アプリケーションのほとんどはそれを知りません。
ルーターは`src/routing/adapters/`に閉じ込め、その外側は自前の
**navigation port**だけに依存します。TanStack Routerへ移る場合も、
差し替えるのはアダプタと`main.tsx`だけです。

## 構成

```text
apps/web/src/
├── main.tsx                      # 使用するアダプタを選ぶ唯一の場所
├── app.tsx                       # router非依存のshell（children を受け取る）
├── pages/                        # 1ルート = 1ページcomponent
└── routing/
    ├── types.ts                  # NavigationPort、RouteMeta
    ├── routes.ts                 # route manifest（純データ）
    ├── route-components.tsx      # RouteId → component
    ├── navigation-context.tsx    # portのReact context
    ├── link.tsx                  # router非依存の<Link>
    ├── link-behavior.ts          # クリックをブラウザへ委ねる条件
    ├── use-document-meta.ts      # titleとmetaの同期
    └── adapters/
        ├── react-router/         # 本番で使うアダプタ
        └── memory/               # テスト用アダプタ
```

## navigation port

アプリが依存してよいルーティング機能は、これだけです。

```ts
export type NavigationPort = {
  location: { pathname: string; search: string };
  navigate: (to: string, options?: { replace?: boolean }) => void;
};
```

componentは`useNavigation()`でこれを取得します。
`react-router`を直接importしてはいけません。
この制約は`src/routing/routing-boundary.test.ts`が検証します。
アダプタ配下と`main.tsx`以外でルーターをimportすると、テストが失敗します。

portを小さく保つことが移植性の条件です。
片方のルーターにしかない機能が必要になったら、portを広げる前に
「それはアプリの関心事か、ルーターの実装詳細か」を判断してください。

## route manifest

`routes.ts`が唯一の正です。パス、title、description、ナビゲーションのラベルを持ちます。

```ts
export const ROUTES = [
  { id: "home", path: "/", title: "...", description: "...", navLabel: "アプリ一覧" },
  { id: "about", path: "/about", title: "...", description: "...", navLabel: "このサイトについて" },
] as const satisfies readonly RouteMeta[];
```

manifestは**importを持たないデータ**です。これにより、
実行時のルーター（`route-components.tsx`経由）とビルド時のVite plugin
（`plugins/static-routes.ts`）の両方から読めます。
componentを混ぜると、Viteの設定がアプリ全体を巻き込みます。

リンクはパスではなくidで書きます。パスの変更がmanifestに閉じます。

```tsx
<Link to="about">このサイトについて</Link>
```

## search params

検索・絞り込みの状態はURLに置き、**zodで検証します**。

```ts
const searchParamsSchema = z.object({
  category: z.enum(["all", ...APPLICATION_CATEGORIES]).catch("all"),
  q: z.string().max(100).catch(""),
});
```

これはルーターの型システムに依存しない設計上の選択です。
TanStack Routerはsearch paramsの型付けとバリデーションを提供しますが、
そこに寄せると移行時にすべて書き直しになります。
アプリ側で検証しておけば、どちらのルーターでも同じルールが動きます。

`catch`は不正な値をデフォルトへ倒します。URLは誰でも書き換えられる入力なので、
エラーにせずページを表示することを優先しています。

## 静的HTMLの生成

GitHub PagesにはSPA fallbackがありません。`/about`へ直接アクセスするには
実ファイルが必要です。`plugins/static-routes.ts`がmanifestから
ルートごとのHTMLを生成します。

```text
dist/index.html         # /
dist/about/index.html   # /about
dist/sitemap.xml
dist/robots.txt
```

各HTMLはそのルートのtitle・description・canonicalを持つため、
クローラはJavaScriptを実行せずに正しいメタ情報を取得できます。
`useDocumentMeta`はクライアント遷移時の同期だけを担当します。

404には2種類あります。

| 経路 | 応答 |
| --- | --- |
| 未知のパスへ直接アクセス | `public/404.html`（HTTP 404、静的） |
| クライアント遷移で未知のパス | `pages/not-found-page.tsx`（SPA内） |

## ルートを追加する

1. `routing/routes.ts`にエントリを追加する（型が`RouteId`を要求します）
2. `pages/<name>-page.tsx`を作り、`useDocumentMeta(findRoute("<id>"))`を呼ぶ
3. `routing/route-components.tsx`にマップを追加する（漏れると型エラー）
4. `pnpm --filter @repo/web build`でHTMLとsitemapを確認する

アダプタもナビゲーションも触る必要はありません。

## TanStack Routerへ移行する

1. `@tanstack/react-router`を追加する
2. `routing/adapters/tanstack-router/`を作る
   - `navigation-provider.tsx`: `useRouter()`と`useRouterState()`で`NavigationPort`を満たす
   - `create-app-router.ts`: `ROUTES`と`ROUTE_COMPONENTS`から`createRouter`のtreeを組む
3. `main.tsx`のimportを差し替える
4. `pnpm --filter @repo/web test`を実行する

`pages/`、`features/`、`components/`、`app.tsx`は変更されません。
境界テストが、移行後もルーターのimportが漏れていないことを保証します。

移らないものもあります。

- **loader / action**: 現在は使っていません。導入すると、データ取得がルーターに結合します。
  featureの`functions`にデータ取得を置き、ページ側で呼ぶ方針を維持すると移植性が保てます。
- **型安全なパスパラメータ**: TanStack Routerの中心的な利点ですが、
  portを通すと失われます。パラメータを持つルートを追加する際は、
  `RouteId`ベースのパス生成関数をmanifestに足して型安全性を自前で確保してください。
- **プリフェッチ**: 各ルーターの`Link`が持つ機能です。必要になったら、
  共通`Link`をアダプタ提供の実装へ切り替える判断をします。

判断の背景は[ADR 0009](decisions/0009-router-agnostic-routing-layer.md)にあります。
