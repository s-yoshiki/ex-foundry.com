import { describe, expect, it } from "vitest";
import {
  errorResponseSchema,
  GREETING_NAME_MAX_LENGTH,
  greetingParamsSchema,
  greetingResponseSchema,
  healthResponseSchema,
} from "./schemas";

describe("healthResponseSchema", () => {
  it('accepts the "ok" status', () => {
    expect(healthResponseSchema.parse({ status: "ok" })).toEqual({ status: "ok" });
  });

  it("rejects any other status", () => {
    expect(healthResponseSchema.safeParse({ status: "degraded" }).success).toBe(false);
  });
});

describe("greetingParamsSchema", () => {
  it("trims surrounding whitespace", () => {
    expect(greetingParamsSchema.parse({ name: "  Codex  " })).toEqual({ name: "Codex" });
  });

  it("rejects an empty or whitespace-only name", () => {
    expect(greetingParamsSchema.safeParse({ name: "" }).success).toBe(false);
    expect(greetingParamsSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects a name longer than the shared limit", () => {
    const tooLong = "a".repeat(GREETING_NAME_MAX_LENGTH + 1);

    expect(greetingParamsSchema.safeParse({ name: tooLong }).success).toBe(false);
    expect(
      greetingParamsSchema.safeParse({ name: "a".repeat(GREETING_NAME_MAX_LENGTH) }).success,
    ).toBe(true);
  });

  it("rejects a missing name", () => {
    expect(greetingParamsSchema.safeParse({}).success).toBe(false);
  });
});

describe("greetingResponseSchema", () => {
  it("requires a message string", () => {
    expect(greetingResponseSchema.safeParse({ message: "Hello!" }).success).toBe(true);
    expect(greetingResponseSchema.safeParse({ message: 1 }).success).toBe(false);
  });
});

describe("errorResponseSchema", () => {
  it("accepts a known error code", () => {
    const payload = { error: { code: "invalid_request", message: "bad input" } };

    expect(errorResponseSchema.parse(payload)).toEqual(payload);
  });

  it("rejects an unknown error code", () => {
    expect(
      errorResponseSchema.safeParse({ error: { code: "teapot", message: "nope" } }).success,
    ).toBe(false);
  });
});
