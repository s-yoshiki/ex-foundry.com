import {
  API_ROUTES,
  type ErrorCode,
  type ErrorResponse,
  GREETING_NAME_MAX_LENGTH,
  type GreetingResponse,
  greetingParamsSchema,
  type HealthResponse,
} from "@ex-foundry/api-contract";
import { zValidator } from "@hono/zod-validator";
import { type ErrorHandler, Hono, type NotFoundHandler } from "hono";

export function errorBody(code: ErrorCode, message: string): ErrorResponse {
  return { error: { code, message } };
}

export const handleNotFound: NotFoundHandler = (context) =>
  context.json(errorBody("not_found", "Route not found."), 404);

export const handleError: ErrorHandler = (error, context) => {
  // Log the cause server-side; the client only ever sees a generic message.
  console.error("Unhandled API error", error);

  return context.json(errorBody("internal_error", "Unexpected server error."), 500);
};

export const app = new Hono()
  .get(API_ROUTES.health, (context) => {
    const body: HealthResponse = { status: "ok" };

    return context.json(body);
  })
  .get(
    API_ROUTES.greeting,
    zValidator("param", greetingParamsSchema, (result, context) => {
      if (!result.success) {
        // The message describes the contract, never the validator internals.
        return context.json(
          errorBody("invalid_request", `name must be 1-${GREETING_NAME_MAX_LENGTH} characters.`),
          400,
        );
      }
    }),
    (context) => {
      const { name } = context.req.valid("param");
      const body: GreetingResponse = { message: `Hello, ${name}!` };

      return context.json(body);
    },
  )
  .notFound(handleNotFound)
  .onError(handleError);

export type AppType = typeof app;
