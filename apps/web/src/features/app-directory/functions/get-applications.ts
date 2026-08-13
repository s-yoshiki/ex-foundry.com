import type { Application } from "../types/application";

const applications = [
  {
    category: "tool",
    description:
      "エンコード・整形・ハッシュ・変換など、開発でよく使うツールをブラウザだけで完結させます。入力したデータはサーバーへ送信しません。",
    host: "devtoys.ex-foundry.com",
    name: "DevToys for web",
    slug: "devtoys",
    stack: ["React", "TypeScript", "Vite"],
    status: "active",
  },
  {
    category: "entertainment",
    description:
      "もぐら叩き・テトリス・オセロなど、しょうもない2Dミニゲームを登録不要ですぐに遊べます。暇つぶし用に思いついた分だけ増えていきます。",
    host: "kusoge.ex-foundry.com",
    name: "クソゲーの森",
    slug: "kusoge",
    stack: ["React", "TypeScript", "Canvas"],
    status: "active",
  },
  {
    category: "entertainment",
    description:
      "診断メーカー・画像加工・ネタ系ジェネレーターを手軽に。生成した結果はそのまま画像として共有できます。",
    host: "maker.ex-foundry.com",
    name: "ひまつぶし研究室",
    slug: "maker",
    stack: ["React", "Canvas", "TypeScript"],
    status: "active",
  },
  {
    category: "data",
    description:
      "日本プロ野球の選手成績を検索・比較・可視化します。年度やチームを横断した集計に対応しています。",
    host: "npb-analysis.ex-foundry.com",
    name: "NPB Analysis",
    slug: "npb",
    stack: ["React", "TypeScript", "D3"],
    status: "beta",
  },
] as const satisfies readonly Application[];

export function getApplications(): readonly Application[] {
  return applications;
}
