import { RemovalPolicy } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { describe, expect, it } from "vitest";
import { ENVIRONMENT_NAMES, isEnvironmentName, resolveEnvironment } from "./environments";

describe("isEnvironmentName", () => {
  it("accepts the declared environments", () => {
    for (const name of ENVIRONMENT_NAMES) {
      expect(isEnvironmentName(name), name).toBe(true);
    }
  });

  it("rejects anything else", () => {
    expect(isEnvironmentName("stg")).toBe(false);
    expect(isEnvironmentName("")).toBe(false);
    expect(isEnvironmentName(undefined)).toBe(false);
    expect(isEnvironmentName(null)).toBe(false);
  });
});

describe("resolveEnvironment", () => {
  it("returns the matching configuration", () => {
    expect(resolveEnvironment("dev").name).toBe("dev");
    expect(resolveEnvironment("prd").name).toBe("prd");
  });

  it("refuses to guess when the environment is missing", () => {
    expect(() => resolveEnvironment(undefined)).toThrow(/Unknown environment/);
    expect(() => resolveEnvironment(undefined)).toThrow(/-c env=/);
  });

  it("rejects an unknown environment", () => {
    expect(() => resolveEnvironment("production")).toThrow(/Unknown environment/);
  });
});

describe("environment policies", () => {
  it("keeps production resources when the stack is deleted", () => {
    expect(resolveEnvironment("prd").removalPolicy).toBe(RemovalPolicy.RETAIN);
    expect(resolveEnvironment("prd").terminationProtection).toBe(true);
  });

  it("makes development disposable", () => {
    expect(resolveEnvironment("dev").removalPolicy).toBe(RemovalPolicy.DESTROY);
    expect(resolveEnvironment("dev").terminationProtection).toBe(false);
  });

  it("retains production logs for longer than development logs", () => {
    expect(resolveEnvironment("dev").logRetention).toBe(RetentionDays.ONE_WEEK);
    expect(resolveEnvironment("prd").logRetention).toBe(RetentionDays.THREE_MONTHS);
  });

  it("pins the region so a deploy does not follow the caller's AWS profile", () => {
    expect(resolveEnvironment("dev").region).toBe("ap-northeast-1");
    expect(resolveEnvironment("prd").region).toBe("ap-northeast-1");
  });

  it("caps development concurrency to limit runaway cost", () => {
    expect(resolveEnvironment("dev").lambda.reservedConcurrentExecutions).toBe(5);
    expect(resolveEnvironment("prd").lambda.reservedConcurrentExecutions).toBeUndefined();
  });
});
