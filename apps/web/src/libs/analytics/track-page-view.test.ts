import { describe, expect, it, vi } from "vitest";
import { trackPageView } from "./track-page-view";

describe("trackPageView", () => {
  it("sends a page_view event with the given location and title", () => {
    const gtag = vi.fn();

    trackPageView(gtag, { pageLocation: "https://ex-foundry.com/about/", pageTitle: "About" });

    expect(gtag).toHaveBeenCalledWith("event", "page_view", {
      page_location: "https://ex-foundry.com/about/",
      page_title: "About",
    });
  });

  it("does nothing when gtag is unavailable", () => {
    expect(() => trackPageView(undefined, { pageLocation: "/", pageTitle: "Home" })).not.toThrow();
  });
});
