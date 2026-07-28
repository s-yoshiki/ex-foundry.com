# Infrastructure

`scripts/infra`はAWS CDKでインフラを定義するworkspaceです。
**1つのAWSアカウントに`dev`と`prd`を共存させる**ことを前提にした叩き台です。

## 構成

```text
scripts/infra/
├── cdk.json                  # app = tsx bin/infra.ts
├── bin/infra.ts              # entrypoint（リポジトリrootを解決するだけ）
└── src/
    ├── environments.ts       # 環境名と環境ごとの設定
    ├── naming.ts             # リソース命名（環境衝突を防ぐ唯一の仕組み）
    ├── app.ts                # stackの組み立てとタグ付け
    └── stacks/api-stack.ts   # apps/api を動かすLambda
```

## 環境の分離

同一アカウントに複数環境を置くため、認証情報では分離できません。
分離は**命名**で行います。

```ts
resourceName("dev", "api");  // ex-foundry-dev-api
stackName("dev", "Api");     // ExFoundry-Dev-Api
```

物理名を持つリソース（Lambda関数、ロググループ、CloudFormation export）には
必ず`resourceName()`を使います。環境セグメントを省くと、
2つ目の環境をデプロイした瞬間に衝突します。
この不変条件は`src/naming.test.ts`と`src/app.test.ts`が検証します。

## 環境ごとの差分

差分は`src/environments.ts`の1か所に集約します。
stack側に`if (env === "prd")`を書かないでください。

| | dev | prd |
| --- | --- | --- |
| メモリ | 256 MB | 512 MB |
| 同時実行数の上限 | 5 | 無制限 |
| ログ保持 | 1週間 | 3ヶ月 |
| ログレベル | debug | info |
| 削除ポリシー | DESTROY | RETAIN |
| stack削除保護 | なし | あり |
| 許可Origin | `http://localhost:5173` | `https://ex-foundry.com` |

regionはコードに固定しています（`ap-northeast-1`）。
実行者のAWSプロファイル次第でデプロイ先が変わることを防ぐためです。
accountは認証情報から解決します。

## 環境の指定

環境はCDK contextで渡します。**デフォルトはありません。**

```sh
pnpm --filter @repo/infra synth -c env=dev
pnpm --filter @repo/infra diff -c env=prd
pnpm --filter @repo/infra deploy -c env=dev
```

指定を忘れた場合は、推測せずに失敗します。

```text
Error: Unknown environment: undefined. Pass one of dev, prd with -c env=<name>.
```

## デプロイ手順

Lambdaは`apps/api`のビルド成果物（`apps/api/dist`）をそのまま使います。
synthの前にビルドが必要です。

```sh
pnpm --filter @repo/api build
pnpm --filter @repo/infra deploy -c env=dev
```

成果物が無い場合、stackは対処方法を含めて失敗します。

初回のみ、アカウント・regionごとにbootstrapが必要です。

```sh
pnpm --filter @repo/infra cdk bootstrap aws://<account-id>/ap-northeast-1
```

デプロイ後、出力された関数URLをWebの環境変数へ設定します。

```sh
# apps/web/.env
VITE_API_BASE_URL=https://xxxxxxxx.lambda-url.ap-northeast-1.on.aws
```

## テスト

CDKのテストは合成されたCloudFormationテンプレートに対して行います。
AWSへの接続は不要で、CIでそのまま実行できます。

```sh
pnpm --filter @repo/infra test
```

検証している内容です。

- 両環境がsynthできること
- 環境ごとにstack名・関数名・ロググループ名・export名が異なること
- prdがRETAINと削除保護を持ち、devがDESTROYであること
- ログ保持期間とメモリが環境ごとに異なること
- CORSが設定したOriginに限定されていること
- 成果物が無いときに対処方法付きで失敗すること

## 拡張するとき

- **新しいstack**: `src/stacks/`に追加し、`src/app.ts`から`constructId`と
  `stackName`を使ってインスタンス化します。
- **新しい環境**（例: `stg`）: `ENVIRONMENT_NAMES`と`ENVIRONMENTS`に追加します。
  型が他の箇所の対応漏れを検出します。
- **API Gatewayや独自ドメイン**: `ApiStack`の中だけを変更します。
  関数URLを選んでいるのは最小構成のためで、外部はこの選択に依存していません。
- **状態を持つリソース**（DynamoDB、S3）: `environment.removalPolicy`を必ず渡します。
  prdの誤削除を防ぐ仕組みはここにしかありません。

## 未対応

叩き台の範囲外として、意図的に含めていないものです。

- CI/CDからの自動デプロイ（現在は手元から実行する前提）
- 監視・アラーム（CloudWatch Alarms、SNS通知）
- カスタムドメインとACM証明書
- VPC、RDS、その他の永続リソース
- 複数アカウント構成への分離
