import { mkdirSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { App, Tags } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveEnvironment } from "./environments";
import { constructId, PROJECT_SLUG, stackName } from "./naming";
import { ApiStack } from "./stacks/api-stack";

let repositoryRoot = "";
let bundleDirectory = "";

beforeEach(async () => {
  repositoryRoot = await mkdtemp(join(tmpdir(), "infra-"));
  bundleDirectory = join(repositoryRoot, "apps", "api", "dist");

  mkdirSync(bundleDirectory, { recursive: true });
  await writeFile(join(bundleDirectory, "index.mjs"), "export const handler = () => {};\n");
});

afterEach(async () => {
  await rm(repositoryRoot, { force: true, recursive: true });
});

function synthesise(environmentName: "dev" | "prd") {
  const environment = resolveEnvironment(environmentName);
  const app = new App();

  Tags.of(app).add("Environment", environment.name);
  Tags.of(app).add("Project", PROJECT_SLUG);

  const stack = new ApiStack(app, constructId(environment.name, "Api"), {
    allowedOrigins: ["https://example.com"],
    bundleDirectory,
    environment,
    stackName: stackName(environment.name, "Api"),
    terminationProtection: environment.terminationProtection,
  });

  return { stack, template: Template.fromStack(stack) };
}

describe("ApiStack", () => {
  it("synthesises for every environment", () => {
    expect(() => synthesise("dev")).not.toThrow();
    expect(() => synthesise("prd")).not.toThrow();
  });

  it("fails with actionable guidance when the API bundle is missing", () => {
    const environment = resolveEnvironment("dev");

    expect(
      () =>
        new ApiStack(new App(), "DevApi", {
          allowedOrigins: [],
          bundleDirectory: join(repositoryRoot, "does-not-exist"),
          environment,
        }),
    ).toThrow(/pnpm --filter @ex-foundry\/api build/);
  });

  it("exposes the handler behind a function URL", () => {
    const { template } = synthesise("dev");

    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs22.x",
    });
    template.hasResourceProperties("AWS::Lambda::Url", { AuthType: "NONE" });
  });

  it("restricts CORS to the configured origins", () => {
    const { template } = synthesise("dev");

    template.hasResourceProperties("AWS::Lambda::Url", {
      Cors: { AllowOrigins: ["https://example.com"], AllowMethods: ["GET"] },
    });
  });
});

describe("environment isolation within one account", () => {
  it("gives each environment a distinct stack name", () => {
    expect(synthesise("dev").stack.stackName).toBe("ExFoundry-Dev-Api");
    expect(synthesise("prd").stack.stackName).toBe("ExFoundry-Prd-Api");
  });

  it("gives each environment a distinct function and log group name", () => {
    synthesise("dev").template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "ex-foundry-dev-api",
    });
    synthesise("prd").template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "ex-foundry-prd-api",
    });

    synthesise("dev").template.hasResourceProperties("AWS::Logs::LogGroup", {
      LogGroupName: "/aws/lambda/ex-foundry-dev-api",
    });
    synthesise("prd").template.hasResourceProperties("AWS::Logs::LogGroup", {
      LogGroupName: "/aws/lambda/ex-foundry-prd-api",
    });
  });

  it("gives each environment a distinct export name", () => {
    const devExports = Object.values(synthesise("dev").template.findOutputs("*")).map(
      (output) => output.Export?.Name,
    );
    const prdExports = Object.values(synthesise("prd").template.findOutputs("*")).map(
      (output) => output.Export?.Name,
    );

    expect(devExports).toContain("ex-foundry-dev-api-url");
    expect(prdExports).toContain("ex-foundry-prd-api-url");
  });
});

describe("environment-specific policies", () => {
  it("deletes development log groups and retains production ones", () => {
    synthesise("dev").template.hasResource("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
    });
    synthesise("prd").template.hasResource("AWS::Logs::LogGroup", {
      DeletionPolicy: "Retain",
    });
  });

  it("keeps production logs longer", () => {
    synthesise("dev").template.hasResourceProperties("AWS::Logs::LogGroup", {
      RetentionInDays: 7,
    });
    synthesise("prd").template.hasResourceProperties("AWS::Logs::LogGroup", {
      RetentionInDays: 90,
    });
  });

  it("gives production more memory and no concurrency cap", () => {
    synthesise("dev").template.hasResourceProperties("AWS::Lambda::Function", {
      MemorySize: 256,
      ReservedConcurrentExecutions: 5,
    });
    synthesise("prd").template.hasResourceProperties("AWS::Lambda::Function", {
      MemorySize: 512,
    });

    const prdFunctions = synthesise("prd").template.findResources("AWS::Lambda::Function");

    for (const resource of Object.values(prdFunctions)) {
      expect(resource.Properties?.ReservedConcurrentExecutions).toBeUndefined();
    }
  });

  it("protects the production stack from deletion", () => {
    expect(synthesise("prd").stack.terminationProtection).toBe(true);
    expect(synthesise("dev").stack.terminationProtection).toBe(false);
  });

  it("passes the stage down to the running function", () => {
    synthesise("prd").template.hasResourceProperties("AWS::Lambda::Function", {
      Environment: { Variables: { LOG_LEVEL: "info", STAGE: "prd" } },
    });
  });
});

describe("tagging", () => {
  it("tags resources with the project and environment", () => {
    synthesise("dev").template.hasResourceProperties("AWS::Lambda::Function", {
      Tags: [
        { Key: "Environment", Value: "dev" },
        { Key: "Project", Value: "ex-foundry" },
      ],
    });
  });
});
