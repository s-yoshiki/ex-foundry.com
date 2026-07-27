import { Hono } from "hono";

export const app = new Hono()
  .get("/health", (context) =>
    context.json({
      status: "ok" as const,
    }),
  )
  .get("/api/greeting/:name", (context) => {
    const name = context.req.param("name");

    return context.json({
      message: `Hello, ${name}!`,
    });
  });

export type AppType = typeof app;
