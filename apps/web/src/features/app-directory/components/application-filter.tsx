import { ChoiceGroup, type ChoiceOption, SearchField } from "@ex-foundry/ui";
import { useMemo } from "react";
import type { CategoryOption } from "../functions/application-labels";
import type { CategoryFilterValue } from "../types/application";

type ApplicationFilterProps = {
  category: CategoryFilterValue;
  onCategoryChange: (category: CategoryFilterValue) => void;
  onQueryChange: (query: string) => void;
  options: readonly CategoryOption[];
  query: string;
};

export function ApplicationFilter({
  category,
  onCategoryChange,
  onQueryChange,
  options,
  query,
}: ApplicationFilterProps) {
  const choices = useMemo<readonly ChoiceOption<CategoryFilterValue>[]>(
    () =>
      options.map((option) => ({
        label: (
          <>
            {option.label}
            <span className="font-mono text-[0.7rem] opacity-75">{option.count}</span>
          </>
        ),
        value: option.value,
      })),
    [options],
  );

  return (
    <div className="mb-5 grid gap-4">
      <SearchField
        id="application-search"
        label="アプリケーションを検索"
        onChange={onQueryChange}
        placeholder="名前・説明・技術スタックで絞り込み"
        value={query}
      />

      <ChoiceGroup
        appearance="chips"
        label="カテゴリ"
        onChange={onCategoryChange}
        options={choices}
        value={category}
      />
    </div>
  );
}
