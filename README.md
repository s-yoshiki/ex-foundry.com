# ex-foundry.com

[EX FOUNDRY](https://ex-foundry.com) で公開しているWebアプリケーションを紹介するポータルサイトです。

## 構成

フレームワーク、パッケージ管理、ビルド処理、JavaScriptは使用していません。

- `index.html`: ページの内容とメタデータ
- `styles.css`: デザインとレスポンシブ対応
- `og.png`: SNS共有画像
- `CNAME`: GitHub Pagesの独自ドメイン
- `robots.txt` / `sitemap.xml`: 検索エンジン向け設定

## ローカル確認

`index.html` をブラウザで直接開くか、任意の静的Webサーバーでリポジトリのルートを配信します。

Pythonが利用できる場合：

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。

## アプリを追加する

`index.html` の `app-list` 内にある `li` を複製し、サイト名、ホスト名（`*.ex-foundry.com`）、説明、公開URLを書き換えます。

## デプロイ

`main` ブランチへのpushでGitHub Actionsがリポジトリの内容をそのままGitHub Pagesへ公開します。ビルド処理はありません。

初回のみ、GitHubリポジトリの **Settings → Pages → Build and deployment** でSourceを **GitHub Actions** に設定してください。

独自ドメインは `CNAME` の `ex-foundry.com` で管理します。DNSプロバイダー側ではGitHub Pagesのドキュメントに従ってapexドメインのA / AAAAレコードを設定し、反映後にGitHub Pagesの設定でHTTPSを有効にします。

## ドキュメント

- [コントリビューションガイド](CONTRIBUTING.md)
- [セキュリティポリシー](SECURITY.md)

## デザイン

ダークな開発者向けUI、細いボーダー、モノスペースの補助情報、紫のアクセントは [AtCoder-JsDebugger](https://github.com/s-yoshiki/AtCoder-JsDebugger) のテーマを参考にしています。
