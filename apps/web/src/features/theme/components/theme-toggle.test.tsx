import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "../functions/theme-preference";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('starts on "自動" when nothing is stored', () => {
    render(<ThemeToggle />);

    expect(screen.getByRole("radio", { name: "自動" })).toHaveAttribute("aria-checked", "true");
  });

  it("applies and persists the chosen theme", async () => {
    const user = userEvent.setup();

    render(<ThemeToggle />);
    await user.click(screen.getByRole("radio", { name: "ライト" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("restores a previously stored preference", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(<ThemeToggle />);

    expect(screen.getByRole("radio", { name: "ダーク" })).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
