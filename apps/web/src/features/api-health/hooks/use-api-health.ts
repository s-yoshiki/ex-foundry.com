import { useEffect, useState } from "react";
import { fetchHealth } from "../functions/fetch-health";
import type { ApiHealthState } from "../types/api-result";

/** Polls the companion API once. Stays `idle` when no API is configured. */
export function useApiHealth(baseUrl: string | undefined): ApiHealthState {
  const [state, setState] = useState<ApiHealthState>({ status: "idle" });

  useEffect(() => {
    if (baseUrl === undefined || baseUrl === "") {
      setState({ status: "idle" });

      return;
    }

    let cancelled = false;

    setState({ status: "loading" });

    void fetchHealth(baseUrl).then((result) => {
      if (cancelled) {
        return;
      }

      setState(
        result.status === "ok" ? { status: "ok" } : { message: result.message, status: "error" },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  return state;
}
