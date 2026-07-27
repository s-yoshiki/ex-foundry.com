import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { app } from "./app";

describe("sample API", () => {
  it("returns its health status", async () => {
    const response = await app.request("/health");

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  });

  it("returns a greeting", async () => {
    const response = await app.request("/api/greeting/Codex");

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { message: "Hello, Codex!" });
  });
});
