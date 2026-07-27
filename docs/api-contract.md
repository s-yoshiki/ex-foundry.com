# API contract

`packages/api-contract`は、`apps/api`と`apps/web`が共有するインタフェース定義です。
型とランタイム検証を1か所に置き、サーバーとクライアントの実装が食い違ったときに
ビルドまたはテストで検出できるようにします。

## なぜappの外に置くか

`apps/web`が`apps/api`を直接importすると、app間に依存が生まれ、
`packages/*`より上位のものを共有する構造になってしまいます。

```text
apps/api ──▶ packages/api-contract ◀── apps/web
```

コントラクトを`packages/*`へ置くことで、依存方向は常にapp → packageに保たれます。

## 構成

```text
packages/api-contract/src/
├── routes.ts     # パス定義とパス生成ヘルパー
├── schemas.ts    # zodスキーマと、そこから導出した型
└── index.ts      # 公開面
```

- `routes.ts`: サーバーはパターンを登録し、クライアントは同じ定義からパスを組み立てます。
  routeをrenameすると両側がビルドエラーになります。
- `schemas.ts`: リクエスト・レスポンス・エラーの形を[zod](https://zod.dev/)で定義します。
  型は`z.infer`で導出し、型定義を二重に書きません。

## サーバー側の使い方

route境界でパラメータを検証し、エラーはコントラクトの形で返します。

```ts
.get(
  API_ROUTES.greeting,
  zValidator("param", greetingParamsSchema, (result, context) => {
    if (!result.success) {
      return context.json(errorBody("invalid_request", "..."), 400);
    }
  }),
  (context) => {
    const { name } = context.req.valid("param");
    const body: GreetingResponse = { message: `Hello, ${name}!` };

    return context.json(body);
  },
)
```

- バリデーションメッセージにはvalidatorの内部情報を含めません。
- `notFound`と`onError`もコントラクトの`ErrorResponse`で返します。
- 内部エラーの詳細はサーバーログにのみ出力します。

## クライアント側の使い方

同じリポジトリの実装でも、レスポンスは信頼境界です。
デプロイ済みAPIがこのビルドより古い可能性があるため、必ずスキーマで検証します。

```ts
const parsed = healthResponseSchema.safeParse(await response.json());

if (!parsed.success) {
  return { message: "APIの応答が共有スキーマと一致しません。", status: "error" };
}
```

失敗は例外ではなく値（`ApiResult`）で表現し、呼び出し側に処理を強制します。

## 環境変数

`apps/web`は`VITE_API_BASE_URL`が設定されているときだけAPIを呼びます。
未設定なら`ApiStatus`は何も描画せず、静的サイトとして完結します。

```sh
cp apps/web/.env.example apps/web/.env
```

## 変更の進め方

1. `packages/api-contract`のスキーマとテストを更新する
2. `pnpm --filter @ex-foundry/api-contract test`で受理・拒否条件を確認する
3. `apps/api`のhandlerを更新する
4. `apps/web`のクライアントを更新する
5. `pnpm typecheck`と`pnpm test`で両側の整合を確認する

後方互換を壊す変更では、サーバーを先にデプロイするか、
移行期間中は両方の形を受理できるようにします。
