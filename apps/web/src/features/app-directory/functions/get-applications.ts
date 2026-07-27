import type { Application } from "../types/application";

const applications = [
  {
    description: "開発でよく使う変換・生成ツールをブラウザだけで。",
    host: "devtoys.ex-foundry.com",
    name: "DevToys for web",
  },
  {
    description: "診断メーカー・画像加工・ネタ系ジェネレーターを手軽に。",
    host: "maker.ex-foundry.com",
    name: "Maker",
  },
  {
    description: "日本プロ野球の選手成績を検索・比較・可視化。",
    host: "npb-analysis.ex-foundry.com",
    name: "NPB Analysis",
  },
] as const satisfies readonly Application[];

export function getApplications(): readonly Application[] {
  return applications;
}
