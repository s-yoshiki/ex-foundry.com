import {
  APPLICATION_CATEGORIES,
  type Application,
  type ApplicationCategory,
  type ApplicationStatus,
  type CategoryFilterValue,
} from "../types/application";

export const CATEGORY_LABELS = {
  data: "データ",
  entertainment: "エンタメ",
  tool: "ツール",
} as const satisfies Record<ApplicationCategory, string>;

export const STATUS_LABELS = {
  active: "公開中",
  beta: "ベータ",
} as const satisfies Record<ApplicationStatus, string>;

export type CategoryOption = {
  count: number;
  label: string;
  value: CategoryFilterValue;
};

/**
 * Builds the category chips: "all" first, then every category that currently
 * has at least one application.
 */
export function buildCategoryOptions(
  applications: readonly Application[],
): readonly CategoryOption[] {
  const populated = APPLICATION_CATEGORIES.map((category) => ({
    count: applications.filter((application) => application.category === category).length,
    label: CATEGORY_LABELS[category],
    value: category satisfies CategoryFilterValue,
  })).filter((option) => option.count > 0);

  return [{ count: applications.length, label: "すべて", value: "all" }, ...populated];
}
