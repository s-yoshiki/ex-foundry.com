#!/usr/bin/env -S node --import tsx
import { relative } from "node:path";
import { parseArgs } from "node:util";
import { createFeature } from "./create-feature";
import { findWorkspaceRoot } from "./workspace-root";

const USAGE = `Usage: pnpm create:feature <feature-name> [--app <app>]

  <feature-name>  kebab-case name of a user-facing capability (e.g. app-directory)
  --app <app>     target application under apps/ (default: web)

See docs/adding-a-feature.md for the conventions this scaffolds.`;

async function main(): Promise<number> {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      app: { default: "web", type: "string" },
      help: { short: "h", type: "boolean" },
    },
  });

  if (values.help === true) {
    console.log(USAGE);

    return 0;
  }

  if (positionals.length !== 1) {
    console.error("feature名を1つ指定してください。\n");
    console.error(USAGE);

    return 1;
  }

  const root = findWorkspaceRoot(process.cwd());

  if (root === undefined) {
    console.error("pnpm-workspace.yaml が見つかりません。リポジトリ内で実行してください。");

    return 1;
  }

  const result = await createFeature({ app: values.app, name: positionals[0] ?? "", root });

  if (!result.ok) {
    console.error(result.reason);

    return 1;
  }

  console.log("次のファイルを作成しました:");

  for (const file of result.createdFiles) {
    console.log(`  ${relative(root, file)}`);
  }

  return 0;
}

process.exitCode = await main();
