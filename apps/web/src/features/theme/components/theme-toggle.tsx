import { ChoiceGroup, type ChoiceOption } from "@ex-foundry/ui";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/use-theme";
import type { ThemePreference } from "../types/theme";

const options: readonly ChoiceOption<ThemePreference>[] = [
  {
    label: (
      <>
        <Monitor aria-hidden="true" className="size-3.5" />
        <span className="sr-only sm:not-sr-only">自動</span>
      </>
    ),
    value: "system",
  },
  {
    label: (
      <>
        <Sun aria-hidden="true" className="size-3.5" />
        <span className="sr-only sm:not-sr-only">ライト</span>
      </>
    ),
    value: "light",
  },
  {
    label: (
      <>
        <Moon aria-hidden="true" className="size-3.5" />
        <span className="sr-only sm:not-sr-only">ダーク</span>
      </>
    ),
    value: "dark",
  },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <ChoiceGroup label="テーマ" onChange={setPreference} options={options} value={preference} />
  );
}
