import type { EnvironmentName } from "./environments";

export const PROJECT_SLUG = "ex-foundry";
export const PROJECT_NAME = "ExFoundry";

/**
 * Physical resource name, e.g. `ex-foundry-dev-api`.
 *
 * Every environment lives in the same AWS account, so nothing may rely on an
 * account-wide unique name. The environment segment is what keeps `dev` and
 * `prd` from colliding.
 */
export function resourceName(environment: EnvironmentName, ...parts: string[]): string {
  return [PROJECT_SLUG, environment, ...parts].join("-");
}

/** CloudFormation stack name, e.g. `ExFoundry-Dev-Api`. */
export function stackName(environment: EnvironmentName, stack: string): string {
  return [PROJECT_NAME, capitalize(environment), stack].join("-");
}

/** Construct id inside the CDK app, e.g. `DevApi`. */
export function constructId(environment: EnvironmentName, stack: string): string {
  return `${capitalize(environment)}${stack}`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
