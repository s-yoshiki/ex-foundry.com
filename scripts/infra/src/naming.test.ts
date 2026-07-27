import { describe, expect, it } from "vitest";
import { ENVIRONMENT_NAMES } from "./environments";
import { constructId, resourceName, stackName } from "./naming";

describe("resourceName", () => {
  it("includes the project and environment", () => {
    expect(resourceName("dev", "api")).toBe("ex-foundry-dev-api");
  });

  it("joins additional segments", () => {
    expect(resourceName("prd", "api", "url")).toBe("ex-foundry-prd-api-url");
  });

  it("produces a different name for every environment", () => {
    const names = ENVIRONMENT_NAMES.map((environment) => resourceName(environment, "api"));

    expect(new Set(names).size).toBe(ENVIRONMENT_NAMES.length);
  });

  it("stays within the 64 character limit of a Lambda function name", () => {
    for (const environment of ENVIRONMENT_NAMES) {
      expect(resourceName(environment, "api").length, environment).toBeLessThanOrEqual(64);
    }
  });
});

describe("stackName", () => {
  it("namespaces the stack by environment", () => {
    expect(stackName("dev", "Api")).toBe("ExFoundry-Dev-Api");
    expect(stackName("prd", "Api")).toBe("ExFoundry-Prd-Api");
  });

  it("never collides across environments", () => {
    const names = ENVIRONMENT_NAMES.map((environment) => stackName(environment, "Api"));

    expect(new Set(names).size).toBe(ENVIRONMENT_NAMES.length);
  });
});

describe("constructId", () => {
  it("prefixes the construct with the environment", () => {
    expect(constructId("dev", "Api")).toBe("DevApi");
  });
});
