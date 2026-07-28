import { cn } from "@repo/ui";
import { useApiHealth } from "../hooks/use-api-health";

const DOT_CLASS = {
  error: "bg-destructive",
  loading: "bg-muted-foreground",
  ok: "bg-primary",
} as const;

/**
 * Shows whether the companion API is reachable. Renders nothing unless
 * `VITE_API_BASE_URL` is configured, so the static build stays API-free.
 */
export function ApiStatus({ baseUrl = import.meta.env.VITE_API_BASE_URL }: { baseUrl?: string }) {
  const state = useApiHealth(baseUrl);

  if (state.status === "idle") {
    return null;
  }

  const label =
    state.status === "loading"
      ? "API: 確認中"
      : state.status === "ok"
        ? "API: 正常"
        : `API: ${state.message}`;

  return (
    <span aria-live="polite" className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cn("size-2 rounded-full", DOT_CLASS[state.status])} />
      {label}
    </span>
  );
}
