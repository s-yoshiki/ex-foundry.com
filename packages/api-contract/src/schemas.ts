import { z } from "zod";

/** Upper bound on a greeting name, enforced identically on both sides. */
export const GREETING_NAME_MAX_LENGTH = 40;

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export const greetingParamsSchema = z.object({
  name: z.string().trim().min(1).max(GREETING_NAME_MAX_LENGTH),
});

export const greetingResponseSchema = z.object({
  message: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.enum(["invalid_request", "not_found", "internal_error"]),
    message: z.string(),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type GreetingParams = z.infer<typeof greetingParamsSchema>;
export type GreetingResponse = z.infer<typeof greetingResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ErrorCode = ErrorResponse["error"]["code"];
