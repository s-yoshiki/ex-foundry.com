import { join } from "node:path";
import { App, Tags } from "aws-cdk-lib";
import { type EnvironmentConfig, resolveEnvironment } from "./environments";
import { constructId, PROJECT_SLUG, stackName } from "./naming";
import { ApiStack } from "./stacks/api-stack";

/** Origins allowed to call the API, per environment. */
const ALLOWED_ORIGINS: Record<EnvironmentConfig["name"], readonly string[]> = {
  dev: ["http://localhost:5173"],
  prd: ["https://ex-foundry.com"],
};

export type BuildAppOptions = {
  /** Repository root, used to locate the built API bundle. */
  readonly repositoryRoot: string;
};

/**
 * Builds the CDK app for a single environment.
 *
 * One synth produces one environment's stacks. Both environments target the
 * same AWS account, so isolation comes from naming rather than from separate
 * credentials — see `naming.ts`.
 */
export function buildApp({ repositoryRoot }: BuildAppOptions): App {
  const app = new App();
  const environment = resolveEnvironment(app.node.tryGetContext("env"));

  Tags.of(app).add("Environment", environment.name);
  Tags.of(app).add("ManagedBy", "cdk");
  Tags.of(app).add("Project", PROJECT_SLUG);

  // biome-ignore lint/correctness/noUnusedInstantiation: CDK constructs register themselves in the construct tree.
  new ApiStack(app, constructId(environment.name, "Api"), {
    allowedOrigins: ALLOWED_ORIGINS[environment.name],
    bundleDirectory: join(repositoryRoot, "apps", "api", "dist"),
    description: `${environment.displayName} API stack for ex-foundry.com`,
    env: {
      // The account comes from the caller's credentials; the region is pinned
      // per environment so a deploy never lands somewhere unintended.
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: environment.region,
    },
    environment,
    stackName: stackName(environment.name, "Api"),
    terminationProtection: environment.terminationProtection,
  });

  return app;
}
