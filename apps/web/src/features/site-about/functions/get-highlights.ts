import type { Highlight } from "../types/highlight";

const highlights = [
  {
    body: "思いついた道具を小さく作り、サブドメインごとに独立したアプリケーションとして公開しています。1つのアプリが壊れても他へ影響しません。",
    title: "小さく作って公開する",
  },
  {
    body: "リポジトリ構成・コマンド・品質基準・CI/CDを共通化し、新しいアプリを始めるときの初期コストを下げています。",
    title: "共通の土台を持つ",
  },
  {
    body: "ソースコードはGitHubで公開しています。ビルドとデプロイはGitHub Actionsで自動化しています。",
    title: "オープンに開発する",
  },
] as const satisfies readonly Highlight[];

export function getHighlights(): readonly Highlight[] {
  return highlights;
}
