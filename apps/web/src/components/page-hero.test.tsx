import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero } from "./page-hero";

describe("PageHero", () => {
  it("renders the eyebrow, heading, and description", () => {
    render(
      <PageHero description="説明文" eyebrow="EYEBROW" title="見出し" titleId="hero-heading" />,
    );

    expect(screen.getByText("EYEBROW")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "見出し" })).toHaveAttribute("id", "hero-heading");
    expect(screen.getByText("説明文")).toBeInTheDocument();
  });

  it("omits the description when none is given", () => {
    render(<PageHero eyebrow="EYEBROW" title="見出し" />);

    expect(screen.queryByText("説明文")).not.toBeInTheDocument();
  });

  it("renders the supplied action", () => {
    render(
      <PageHero action={<button type="button">検索</button>} eyebrow="EYEBROW" title="見出し" />,
    );

    expect(screen.getByRole("button", { name: "検索" })).toBeInTheDocument();
  });
});
