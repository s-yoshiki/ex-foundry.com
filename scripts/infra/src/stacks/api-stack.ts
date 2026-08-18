import { existsSync } from "node:fs";
import { CfnOutput, Stack, type StackProps } from "aws-cdk-lib";
import {
  Architecture,
  Code,
  FunctionUrlAuthType,
  HttpMethod,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "../environments";
import { resourceName } from "../naming";

export type ApiStackProps = StackProps & {
  /** Directory holding the built `index.mjs` from `apps/api`. */
  readonly bundleDirectory: string;
  readonly environment: EnvironmentConfig;
  /** Origins allowed to call the function URL. */
  readonly allowedOrigins: readonly string[];
};

/**
 * Serves `apps/api` from a Lambda function URL.
 *
 * A function URL keeps the baseline small — no API Gateway, no custom domain,
 * no VPC. Swap in an `HttpApi` here when the API needs routing, authorisers, or
 * a custom domain; nothing outside this stack depends on the choice.
 */
export class ApiStack extends Stack {
  readonly functionUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { allowedOrigins, bundleDirectory, environment } = props;

    if (!existsSync(bundleDirectory)) {
      throw new Error(
        `API bundle not found at ${bundleDirectory}. ` +
          "Run `pnpm --filter @repo/api build` before synthesising.",
      );
    }

    // Declared explicitly so the retention policy is ours rather than the
    // implicit, never-expiring log group Lambda would create on first invoke.
    const logGroup = new LogGroup(this, "ApiLogs", {
      logGroupName: `/aws/lambda/${resourceName(environment.name, "api")}`,
      removalPolicy: environment.removalPolicy,
      retention: environment.logRetention,
    });

    const handler = new LambdaFunction(this, "ApiFunction", {
      architecture: Architecture.ARM_64,
      code: Code.fromAsset(bundleDirectory),
      description: `${environment.displayName} API for ex-foundry.com`,
      environment: {
        LOG_LEVEL: environment.logLevel,
        NODE_OPTIONS: "--enable-source-maps",
        STAGE: environment.name,
      },
      functionName: resourceName(environment.name, "api"),
      handler: "index.handler",
      logGroup,
      memorySize: environment.lambda.memorySize,
      reservedConcurrentExecutions: environment.lambda.reservedConcurrentExecutions,
      runtime: Runtime.NODEJS_22_X,
      timeout: environment.lambda.timeout,
    });

    const url = handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedHeaders: ["content-type"],
        allowedMethods: [HttpMethod.GET],
        allowedOrigins: [...allowedOrigins],
        maxAge: environment.lambda.timeout,
      },
    });

    this.functionUrl = url.url;

    // biome-ignore lint/correctness/noUnusedInstantiation: CDK outputs register themselves in the construct tree.
    new CfnOutput(this, "ApiUrl", {
      description: "Base URL for VITE_API_BASE_URL",
      exportName: resourceName(environment.name, "api", "url"),
      value: url.url,
    });
  }
}
