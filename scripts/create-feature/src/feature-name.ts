const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/** Feature names that describe a layer or a dumping ground, not a capability. */
const VAGUE_NAMES = new Set(["common", "core", "helpers", "misc", "shared", "utils", "util"]);

export type FeatureNameResult = { name: string; valid: true } | { reason: string; valid: false };

/**
 * Validates a feature directory name against the conventions in
 * docs/adding-a-feature.md.
 */
export function parseFeatureName(input: string): FeatureNameResult {
  const name = input.trim();

  if (name === "") {
    return { reason: "feature名を指定してください。", valid: false };
  }

  if (!KEBAB_CASE.test(name)) {
    return {
      reason: `"${name}" はkebab-caseではありません。英小文字・数字・ハイフンで指定してください。`,
      valid: false,
    };
  }

  if (VAGUE_NAMES.has(name)) {
    return {
      reason: `"${name}" は責務が曖昧です。ユーザーが認識できる機能名を指定してください。`,
      valid: false,
    };
  }

  return { name, valid: true };
}

/** `app-directory` -> `ApplicationDirectory`-style PascalCase. */
export function toPascalCase(name: string): string {
  return name
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}
