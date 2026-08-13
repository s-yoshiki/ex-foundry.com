import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryNavigationProvider } from "../../../routing/adapters/memory/memory-navigation";
import { getApplications } from "../functions/get-applications";
import { ApplicationList } from "./application-list";

function renderList(initialUrl = "/") {
  const navigations: string[] = [];

  render(
    <MemoryNavigationProvider initialUrl={initialUrl} onNavigate={(url) => navigations.push(url)}>
      <ApplicationList />
    </MemoryNavigationProvider>,
  );

  return navigations;
}

describe("ApplicationList", () => {
  it("links each application to its product page", () => {
    renderList("/apps");

    for (const application of getApplications()) {
      expect(screen.getByRole("link", { name: new RegExp(application.name) })).toHaveAttribute(
        "href",
        `/products/${application.slug}/`,
      );
    }
  });

  it("reports how many applications are visible", () => {
    renderList("/apps");

    const total = getApplications().length;

    expect(screen.getByText(`${total}件を表示中（全${total}件）`)).toBeInTheDocument();
  });

  it("narrows the list as the query is typed", async () => {
    const user = userEvent.setup();

    renderList();
    await user.type(screen.getByLabelText("アプリケーションを検索"), "NPB");

    expect(screen.getByRole("link", { name: /NPB Analysis/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /DevToys/ })).not.toBeInTheDocument();
  });

  it("narrows the list when a category chip is selected", async () => {
    const user = userEvent.setup();

    renderList();

    const categories = screen.getByRole("radiogroup", { name: "カテゴリ" });
    await user.click(within(categories).getByRole("radio", { name: /データ/ }));

    expect(screen.getByRole("link", { name: /NPB Analysis/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /DevToys/ })).not.toBeInTheDocument();
  });

  it("restores the filter from the URL", () => {
    renderList("/?q=devtoys");

    expect(screen.getByLabelText("アプリケーションを検索")).toHaveValue("devtoys");
    expect(screen.getByRole("link", { name: /DevToys/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /NPB Analysis/ })).not.toBeInTheDocument();
  });

  it("writes the active filter into the URL", async () => {
    const user = userEvent.setup();
    const navigations = renderList();

    const categories = screen.getByRole("radiogroup", { name: "カテゴリ" });
    await user.click(within(categories).getByRole("radio", { name: /ツール/ }));

    expect(navigations.at(-1)).toBe("/apps?category=tool");
  });

  it("ignores an unusable category in the URL", () => {
    renderList("/apps?category=nonsense");

    const total = getApplications().length;

    expect(screen.getByText(`${total}件を表示中（全${total}件）`)).toBeInTheDocument();
  });

  it("explains an empty result instead of rendering an empty list", async () => {
    const user = userEvent.setup();

    renderList();
    await user.type(screen.getByLabelText("アプリケーションを検索"), "存在しないアプリ");

    const total = getApplications().length;

    expect(screen.getByText(/条件に一致するアプリケーションはありません/)).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByText(`0件を表示中（全${total}件）`)).toBeInTheDocument();
  });
});
