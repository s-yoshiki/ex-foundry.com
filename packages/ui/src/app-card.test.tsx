import { Badge } from "@ex-foundry/ui/components/ui/badge";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppCard } from "./app-card";

describe("AppCard", () => {
  it("renders the name, host, and description inside a single link", () => {
    render(
      <AppCard
        description="開発でよく使う変換ツール。"
        host="devtoys.example.com"
        href="https://devtoys.example.com/"
        name="DevToys"
      />,
    );

    const link = screen.getByRole("link", { name: /DevToys/ });

    expect(link).toHaveAttribute("href", "https://devtoys.example.com/");
    expect(link).toHaveTextContent("devtoys.example.com");
    expect(link).toHaveTextContent("開発でよく使う変換ツール。");
  });

  it("renders the badge and tags when supplied", () => {
    render(
      <AppCard
        badge={<Badge>公開中</Badge>}
        description="説明"
        host="app.example.com"
        href="https://app.example.com/"
        name="App"
        tags={["React", "Vite"]}
      />,
    );

    expect(screen.getByText("公開中")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vite")).toBeInTheDocument();
  });

  it("omits the tag row when there are no tags", () => {
    render(
      <AppCard
        description="説明"
        host="app.example.com"
        href="https://app.example.com/"
        name="App"
      />,
    );

    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /App/ }).querySelectorAll("[data-slot='badge']"),
    ).toHaveLength(0);
  });
});
