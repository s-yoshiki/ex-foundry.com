import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiStatus } from "./api-status";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ApiStatus", () => {
  it("renders nothing when no API is configured", () => {
    const { container } = render(<ApiStatus baseUrl={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("reports a healthy API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: "ok" }), {
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    render(<ApiStatus baseUrl="http://api.example.com" />);

    await waitFor(() => expect(screen.getByText("API: 正常")).toBeInTheDocument());
  });

  it("surfaces a failure message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(<ApiStatus baseUrl="http://api.example.com" />);

    await waitFor(() =>
      expect(screen.getByText("API: APIへ接続できませんでした。")).toBeInTheDocument(),
    );
  });
});
