import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { App } from "./app";
import { AboutPage } from "./pages/about-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { MemoryNavigationProvider } from "./routing/adapters/memory/memory-navigation";

function renderApp(page: ReactNode, initialUrl = "/") {
  const navigations: string[] = [];

  render(
    <MemoryNavigationProvider initialUrl={initialUrl} onNavigate={(url) => navigations.push(url)}>
      <App>{page}</App>
    </MemoryNavigationProvider>,
  );

  return navigations;
}

describe("App shell", () => {
  it("exposes the expected document landmarks", () => {
    renderApp(<HomePage />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("offers a skip link that targets the main landmark", () => {
    renderApp(<HomePage />);

    expect(screen.getByRole("link", { name: "本文へスキップ" })).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("renders a single level-one heading on every page", () => {
    renderApp(<AboutPage />, "/about");

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("marks the active navigation entry", () => {
    renderApp(<AboutPage />, "/about");

    const nav = screen.getByRole("navigation", { name: "サイト内" });

    expect(within(nav).getByRole("link", { name: "このサイトについて" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "アプリ一覧" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("navigates through the port when a nav link is clicked", async () => {
    const user = userEvent.setup();
    const navigations = renderApp(<HomePage />);

    const nav = screen.getByRole("navigation", { name: "サイト内" });
    await user.click(within(nav).getByRole("link", { name: "このサイトについて" }));

    expect(navigations).toEqual(["/about"]);
  });
});

describe("pages", () => {
  it("sets the document title from the route manifest", () => {
    renderApp(<AboutPage />, "/about");

    expect(document.title).toBe("EX FOUNDRYについて - EX FOUNDRY");
  });

  it("renders the application directory on the home page", () => {
    renderApp(<HomePage />);

    expect(screen.getByRole("region", { name: "アプリケーション" })).toBeInTheDocument();
  });

  it("renders the about content on the about page", () => {
    renderApp(<AboutPage />, "/about");

    expect(screen.getByRole("region", { name: "EX FOUNDRYについて" })).toBeInTheDocument();
  });

  it("offers a way back from the not found page", () => {
    renderApp(<NotFoundPage />, "/nope");

    expect(screen.getByRole("heading", { name: "ページが見つかりません" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "トップページへ戻る" })).toHaveAttribute("href", "/");
  });
});
