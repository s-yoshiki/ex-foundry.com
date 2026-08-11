# Testing

## テストランナー

全workspaceで [Vitest](https://vitest.dev/) を使います。ランナーを1つに統一し、
設定・レポート・カバレッジの読み方を揃えることを優先しています。

```sh
pnpm test              # 全workspace
pnpm test:coverage     # カバレッジ付き
pnpm --filter @repo/web test:watch
```

各workspaceは自身の`vitest.config.ts`を持ちます（`apps/web`のみ`vite.config.ts`に統合）。

| workspace | environment | 主な対象 |
| --- | --- | --- |
| `apps/web` | `happy-dom` | feature、component、Reactのhook |
| `apps/api` | `node` | route、バリデーション、エラーハンドリング |
| `packages/ui` | `happy-dom` | UIプリミティブの振る舞いとアクセシビリティ |
| `packages/api-contract` | `node` | スキーマの受理・拒否条件 |
| `scripts/*` | `node` | CLIの入力検証とファイル生成 |

## 何をテストするか

### functions

分岐と境界値をunit testで押さえます。純粋関数はReactに依存しないため、
最も安く、最も壊れにくいテストになります。

```ts
expect(filterApplications(applications, { category: "all", query: "react rust" })).toHaveLength(0);
```

### hooks / components

「ユーザーに見える振る舞い」をTesting Libraryで確認します。
実装の詳細（内部stateの名前、classNameなど）には依存させません。

- 取得はrole・ラベル・テキストで行い、`data-testid`は最後の手段にします。
- 空状態、エラー状態、絞り込み結果0件のような分岐を必ず含めます。
- landmark、見出し階層、フォームラベルの関連付けを検証します。

```tsx
await user.type(screen.getByLabelText("アプリケーションを検索"), "NPB");
expect(screen.queryByRole("link", { name: /DevToys/ })).not.toBeInTheDocument();
```

### API

正常系だけでなく、信頼境界を必ずテストします。

- 不正入力が400になること
- 未知のrouteが契約どおりの404を返すこと
- 内部エラーの詳細（stack trace、接続情報）がレスポンスへ漏れないこと

```ts
expect(text).not.toContain("database password");
```

### 共有コントラクト

`packages/api-contract`のスキーマは、**受理する入力と拒否する入力の両方**を書きます。
スキーマを緩めた変更が、テストの差分として見えるようにするためです。

## 外部依存

- ネットワークをCIから直接叩きません。`fetch`は引数で差し替えるか`vi.stubGlobal`します。
- 時刻・乱数に依存する処理は、値を注入できる形にします。
- fixtureはテストファイルの近くに置き、本番データを持ち込みません。

```ts
const result = await fetchHealth("http://api.example.com", fetchImpl);
```

## 環境の注意点

Vitestはwindowのプロパティを固定リストでglobalへ複製するため、`localStorage`は
DOM実装に関わらずテスト環境に存在しません。`apps/web/src/test-setup.ts`が
同等の実装を用意しています。ブラウザAPIを新たに使う場合は、同じ場所で補います。

`@testing-library/jest-dom`は`/vitest`ではなく`/matchers`から読み込みます。
`/vitest`エントリが自身のパッケージ内から`vitest`をimportするため、
pnpmのisolated node_modulesでは解決できません。

Testing Libraryの自動cleanupはVitestのglobalsが有効なときだけ登録されます。
本リポジトリは`globals: false`のため、setupファイルで`afterEach(cleanup)`を明示しています。

## カバレッジ

カバレッジは目標値ではなく、テストされていない分岐を見つけるために使います。
`src/main.tsx`やCLIのエントリポイントのように、振る舞いを持たないファイルは除外します。

## 検証コマンド

```sh
pnpm verify
```
