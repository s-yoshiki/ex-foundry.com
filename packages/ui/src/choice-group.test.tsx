import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChoiceGroup } from "./choice-group";

const options = [
  { label: "自動", value: "system" },
  { label: "ライト", value: "light" },
] as const;

describe("ChoiceGroup", () => {
  it("exposes a labelled radio group", () => {
    render(<ChoiceGroup label="テーマ" onChange={() => {}} options={options} value="system" />);

    expect(screen.getByRole("radiogroup", { name: "テーマ" })).toBeInTheDocument();
  });

  it("marks only the active option as pressed", () => {
    render(<ChoiceGroup label="テーマ" onChange={() => {}} options={options} value="light" />);

    expect(screen.getByRole("radio", { name: "自動" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "ライト" })).toHaveAttribute("aria-checked", "true");
  });

  it("reports the newly selected value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ChoiceGroup label="テーマ" onChange={onChange} options={options} value="system" />);
    await user.click(screen.getByRole("radio", { name: "ライト" }));

    expect(onChange).toHaveBeenCalledWith("light");
  });

  it("never clears the selection when the active option is clicked again", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ChoiceGroup label="テーマ" onChange={onChange} options={options} value="system" />);
    await user.click(screen.getByRole("radio", { name: "自動" }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
