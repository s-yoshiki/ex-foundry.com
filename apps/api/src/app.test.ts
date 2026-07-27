import {
  errorResponseSchema,
  GREETING_NAME_MAX_LENGTH,
  greetingPath,
  greetingResponseSchema,
  healthPath,
  healthResponseSchema,
} from "@ex-foundry/api-contract";
import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import { app, handleError } from "./app";

describe("health route", () => {
  it("returns a body matching the shared schema", async () => {
    const response = await app.request(healthPath());

    expect(response.status).toBe(200);
    expect(healthResponseSchema.parse(await response.json())).toEqual({ status: "ok" });
  });
});

describe("greeting route", () => {
  it("greets a valid name", async () => {
    const response = await app.request(greetingPath("Codex"));

    expect(response.status).toBe(200);
    expect(greetingResponseSchema.parse(await response.json())).toEqual({
      message: "Hello, Codex!",
    });
  });

  it("greets a non-ASCII name", async () => {
    const response = await app.request(greetingPath("さくら"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Hello, さくら!" });
  });

  it("trims the name before greeting", async () => {
    const response = await app.request(greetingPath("  Codex  "));

    expect(await response.json()).toEqual({ message: "Hello, Codex!" });
  });

  it("rejects a name longer than the contract allows", async () => {
    const response = await app.request(greetingPath("a".repeat(GREETING_NAME_MAX_LENGTH + 1)));

    expect(response.status).toBe(400);
    expect(errorResponseSchema.parse(await response.json()).error.code).toBe("invalid_request");
  });

  it("rejects a blank name", async () => {
    const response = await app.request("/api/greeting/%20");

    expect(response.status).toBe(400);
    expect(errorResponseSchema.parse(await response.json()).error.code).toBe("invalid_request");
  });

  it("does not reflect rejected input back to the caller", async () => {
    const response = await app.request(greetingPath("<script>alert(1)</script>".repeat(3)));
    const text = await response.text();

    expect(response.status).toBe(400);
    expect(text).not.toContain("<script>");
  });
});

describe("error handling", () => {
  it("returns a contract-shaped 404 for unknown routes", async () => {
    const response = await app.request("/does-not-exist");

    expect(response.status).toBe(404);
    expect(errorResponseSchema.parse(await response.json()).error.code).toBe("not_found");
  });

  it("hides internal failures behind a generic 500", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const failing = new Hono()
      .get("/boom", () => {
        throw new Error("database password leaked in this message");
      })
      .onError(handleError);

    const response = await failing.request("/boom");
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(errorResponseSchema.parse(JSON.parse(text)).error.code).toBe("internal_error");
    expect(text).not.toContain("database password");

    consoleError.mockRestore();
  });
});
