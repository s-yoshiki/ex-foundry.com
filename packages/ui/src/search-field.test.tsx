import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "./search-field";

describe("SearchField", () => {
  it("associates the label with the input", () => {
    render(<SearchField id="search" label="検索" onChange={() => {}} value="" />);

    expect(screen.getByLabelText("検索")).toBeInTheDocument();
  });

  it("reports each typed character as a plain string", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchField id="search" label="検索" onChange={onChange} value="" />);
    await user.type(screen.getByLabelText("検索"), "ab");

    expect(onChange).toHaveBeenNthCalledWith(1, "a");
    expect(onChange).toHaveBeenNthCalledWith(2, "b");
  });
});
