export const EDITORIAL_POLICY_SECTIONS = [
  {
    heading: "このサイトで扱うテーマ",
    paragraphs: [
      "EX FOUNDRYでは、個人開発したWebアプリケーションの設計、実装、テスト、運用で得た知見を、あとから再現できる形で記録します。開発者が実際に試した手順や判断を中心に扱い、公式ドキュメントだけでは分かりにくい比較や失敗も残します。",
    ],
  },
  {
    heading: "記事の構成",
    paragraphs: [
      "記事では、対象とする課題、前提となる環境、実装した内容、確認できた結果、残っている制約をできるだけ分けて説明します。外部サービスやライブラリの仕様については、公開時点で参照した公式資料へのリンクを添えます。",
    ],
  },
  {
    heading: "更新と訂正",
    paragraphs: [
      "画面、料金、API、ライブラリの仕様は変わるため、古い記事には注意書きを表示しています。誤り、リンク切れ、現在の仕様との不一致を見つけた場合は、お問い合わせページから知らせてください。確認した内容は記事の修正や追記に反映します。",
    ],
  },
  {
    heading: "生成AIの利用",
    paragraphs: [
      "生成AIを調査、文章整理、コード例の下書きなどに利用した記事には、記事上でその旨を表示します。公開前に内容を確認し、実行結果や公式資料と照合しますが、生成AIの利用だけで内容の正確性が保証されるわけではありません。重要な判断では必ず一次資料を確認してください。",
    ],
  },
  {
    heading: "外部資料と著作権",
    paragraphs: [
      "記事中の外部資料、画像、コードは、出典やライセンスを確認したうえで利用します。第三者の文章を転載することを目的とせず、実装上の検証結果や自分の判断を加えて紹介します。権利上の問題がある掲載物を見つけた場合も、お問い合わせください。",
    ],
  },
] as const;

export const EDITORIAL_POLICY_STEPS = [
  "解決したい課題と対象読者を定める",
  "使用した環境・バージョン・前提条件を記録する",
  "手順やコードを実行し、得られた結果と制約を確認する",
  "公式資料や参照元を確認し、公開後も仕様変更を見直す",
] as const;

export const CONTACT_CHANNELS = [
  {
    description: "記事の誤り、リンク切れ、仕様変更、追記の提案を受け付けています。",
    href: "https://github.com/s-yoshiki/ex-foundry.com/issues/new",
    label: "GitHub Issuesで記事を知らせる",
    title: "記事の修正・更新依頼",
  },
  {
    description: "EX FOUNDRYで公開しているWebアプリケーションの不具合や改善案を受け付けています。",
    href: "https://github.com/s-yoshiki/ex-foundry.com/issues/new",
    label: "GitHub Issuesで不具合を知らせる",
    title: "アプリケーションについて",
  },
  {
    description: "運営者や公開しているプロジェクトについて確認したい場合はこちらをご覧ください。",
    href: "https://github.com/s-yoshiki",
    label: "GitHubプロフィールを見る",
    title: "運営者について",
  },
] as const;
