import { describe, expect, it, vi } from "vitest";
import { fetchHealth } from "./fetch-health";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });
}

describe("fetchHealth", () => {
  it("requests the health route against the configured origin", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ status: "ok" }));

    await fetchHealth("http://api.example.com", fetchImpl as unknown as typeof fetch);

    const [url] = fetchImpl.mock.calls[0] ?? [];

    expect(String(url)).toBe("http://api.example.com/health");
  });

  it("returns the parsed body on success", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ status: "ok" }));

    const result = await fetchHealth(
      "http://api.example.com",
      fetchImpl as unknown as typeof fetch,
    );

    expect(result).toEqual({ data: { status: "ok" }, status: "ok" });
  });

  it("reports an error status code without throwing", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}, 503));

    const result = await fetchHealth(
      "http://api.example.com",
      fetchImpl as unknown as typeof fetch,
    );

    expect(result).toEqual({ message: "APIが503を返しました。", status: "error" });
  });

  it("reports a response that does not match the shared schema", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ status: "degraded" }));

    const result = await fetchHealth(
      "http://api.example.com",
      fetchImpl as unknown as typeof fetch,
    );

    expect(result).toEqual({
      message: "APIの応答が共有スキーマと一致しません。",
      status: "error",
    });
  });

  it("reports a network failure", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("offline"));

    const result = await fetchHealth(
      "http://api.example.com",
      fetchImpl as unknown as typeof fetch,
    );

    expect(result).toEqual({ message: "APIへ接続できませんでした。", status: "error" });
  });

  it("reports an unusable base URL instead of throwing", async () => {
    const fetchImpl = vi.fn();

    const result = await fetchHealth("not a url", fetchImpl as unknown as typeof fetch);

    expect(result.status).toBe("error");
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
