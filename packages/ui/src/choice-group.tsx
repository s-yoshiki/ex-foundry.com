import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/ui/toggle-group";
import { cn } from "@repo/ui/lib/utils";
import type { ReactNode } from "react";

export type ChoiceOption<TValue extends string> = {
  label: ReactNode;
  value: TValue;
};

type ChoiceGroupProps<TValue extends string> = {
  /** `segmented` renders one joined bar, `chips` renders separated pills. */
  appearance?: "segmented" | "chips";
  className?: string;
  label: string;
  onChange: (value: TValue) => void;
  options: readonly ChoiceOption<TValue>[];
  value: TValue;
};

const SELECTED = "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

/**
 * Single-select control over shadcn's ToggleGroup. Unlike the primitive, the
 * selection can never be emptied — there is always exactly one active value.
 */
export function ChoiceGroup<TValue extends string>({
  appearance = "segmented",
  className,
  label,
  onChange,
  options,
  value,
}: ChoiceGroupProps<TValue>) {
  const isChips = appearance === "chips";

  return (
    <ToggleGroup
      aria-label={label}
      className={cn(isChips && "flex-wrap", className)}
      onValueChange={(next) => {
        // Radix reports an empty string when the active item is toggled off.
        if (next !== "") {
          onChange(next as TValue);
        }
      }}
      spacing={isChips ? 2 : 0}
      type="single"
      value={value}
      variant="outline"
    >
      {options.map((option) => (
        <ToggleGroupItem
          className={cn(SELECTED, isChips && "rounded-full px-4")}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
