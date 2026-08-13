import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "./entry-server";

function renderRouteIntoDocument(path: string, options?: { articleHtml?: string }) {
  document.body.innerHTML = `<div id="root">${renderRoute(path, options)}</div>`;
  return within(document.body);
}

describe("renderRoute", () => {
  it("renders the site chrome on every route", () => {
    const view = renderRouteIntoDocument("/about");

    expect(view.getByRole("banner")).toBeInTheDocument();
    expect(view.getByRole("navigation", { name: "サイト内" })).toBeInTheDocument();
    expect(view.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the home page with the products grid", () => {
    const view = renderRouteIntoDocument("/");

    expect(view.getByRole("heading", { name: /個人開発プロダクトを/ })).toBeInTheDocument();
    expect(view.getByText("DevToys for web")).toBeInTheDocument();
  });

  it("renders a product page for a known slug", () => {
    const view = renderRouteIntoDocument("/products/kusoge");

    expect(view.getByRole("heading", { name: "クソゲーの森" })).toBeInTheDocument();
  });

  it("renders the not-found fallback for an unknown product slug", () => {
    const view = renderRouteIntoDocument("/products/does-not-exist");

    expect(view.getByRole("heading", { name: "プロダクトが見つかりません" })).toBeInTheDocument();
  });

  it("embeds the pre-rendered article body instead of the client-side loading placeholder", () => {
    const view = renderRouteIntoDocument("/entry/1201", { articleHtml: "<p>本文テスト</p>" });

    expect(view.getByText("本文テスト")).toBeInTheDocument();
    expect(view.queryByText("記事本文を読み込んでいます…")).not.toBeInTheDocument();
  });

  it("falls back to the not-found page for an unmatched path", () => {
    const view = renderRouteIntoDocument("/nope");

    expect(view.getByRole("heading", { name: "ページが見つかりません" })).toBeInTheDocument();
  });

  it("renders the contact channels", () => {
    const view = renderRouteIntoDocument("/contact");

    expect(view.getByRole("heading", { name: "お問い合わせ" })).toBeInTheDocument();
    expect(view.getByText("GitHub Issuesで記事を知らせる")).toBeInTheDocument();
  });

  it("renders the editorial policy steps", () => {
    const view = renderRouteIntoDocument("/editorial-policy");

    expect(view.getByRole("heading", { name: "編集方針" })).toBeInTheDocument();
    expect(view.getByText("記事を公開するまで")).toBeInTheDocument();
  });

  it("renders the article index with its type filters", () => {
    const view = renderRouteIntoDocument("/articles");

    expect(view.getByRole("heading", { name: "プロダクト情報" })).toBeInTheDocument();
    expect(view.getByRole("navigation", { name: "記事の分類" })).toBeInTheDocument();
  });

  it("renders the changelog with only release posts", () => {
    const view = renderRouteIntoDocument("/changelog");

    expect(view.getByRole("heading", { name: "更新履歴" })).toBeInTheDocument();
  });
});
