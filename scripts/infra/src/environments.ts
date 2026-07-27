import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export const ENVIRONMENT_NAMES = ["dev", "prd"] as const;

export type EnvironmentName = (typeof ENVIRONMENT_NAMES)[number];

export type EnvironmentConfig = {
  /** Human-readable name used in stack descriptions. */
  readonly displayName: string;
  /** Lambda log verbosity, passed to the function as an environment variable. */
  readonly logLevel: "debug" | "info";
  readonly logRetention: RetentionDays;
  readonly lambda: {
    readonly memorySize: number;
    /** Caps blast radius and cost; `undefined` means unreserved. */
    readonly reservedConcurrentExecutions: number | undefined;
    readonly timeout: Duration;
  };
  readonly name: EnvironmentName;
  /**
   * Pinned in code rather than taken from the caller's AWS profile, so the same
   * command deploys to the same place from any machine.
   */
  readonly region: string;
  /**
   * Whether stateful resources survive a stack deletion. Production keeps its
   * data; development is meant to be thrown away and rebuilt.
   */
  readonly removalPolicy: RemovalPolicy;
  /** Blocks `cdk destroy` and console deletion of the stack. */
  readonly terminationProtection: boolean;
};

const ENVIRONMENTS: Record<EnvironmentName, EnvironmentConfig> = {
  dev: {
    displayName: "Development",
    lambda: {
      memorySize: 256,
      reservedConcurrentExecutions: 5,
      timeout: Duration.seconds(10),
    },
    logLevel: "debug",
    logRetention: RetentionDays.ONE_WEEK,
    name: "dev",
    region: "ap-northeast-1",
    removalPolicy: RemovalPolicy.DESTROY,
    terminationProtection: false,
  },
  prd: {
    displayName: "Production",
    lambda: {
      memorySize: 512,
      reservedConcurrentExecutions: undefined,
      timeout: Duration.seconds(10),
    },
    logLevel: "info",
    logRetention: RetentionDays.THREE_MONTHS,
    name: "prd",
    region: "ap-northeast-1",
    removalPolicy: RemovalPolicy.RETAIN,
    terminationProtection: true,
  },
};

export function isEnvironmentName(value: unknown): value is EnvironmentName {
  return ENVIRONMENT_NAMES.includes(value as EnvironmentName);
}

/**
 * Resolves the target environment from CDK context.
 *
 * Deliberately has no default: deploying to the wrong environment because a
 * flag was forgotten is the failure mode this guards against.
 */
export function resolveEnvironment(value: unknown): EnvironmentConfig {
  if (!isEnvironmentName(value)) {
    throw new Error(
      `Unknown environment: ${JSON.stringify(value)}. ` +
        `Pass one of ${ENVIRONMENT_NAMES.join(", ")} with -c env=<name>.`,
    );
  }

  return ENVIRONMENTS[value];
}
