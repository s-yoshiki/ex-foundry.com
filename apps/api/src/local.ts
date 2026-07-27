import { serve } from "@hono/node-server";
import { app } from "./app";

const port = Number.parseInt(process.env.PORT ?? "3001", 10);

serve(
  {
    fetch: app.fetch,
    port,
  },
  ({ port: activePort }) => {
    console.log(`API server listening on http://localhost:${activePort}`);
  },
);
