import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagList } from "./tag-list";

describe("TagList", () => {
  it("renders a labelled list of tags", () => {
    render(<TagList items={["React", "Vite"]} label="技術スタック" />);

    const list = screen.getByRole("list", { name: "技術スタック" });

    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(<TagList items={[]} label="技術スタック" />);

    expect(container).toBeEmptyDOMElement();
  });
});
