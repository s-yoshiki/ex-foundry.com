import { type HealthResponse, healthPath, healthResponseSchema } from "@ex-foundry/api-contract";
import type { ApiResult } from "../types/api-result";

/**
 * Calls the companion API's health route.
 *
 * The response is an untrusted boundary even though both sides live in this
 * repository: the deployed API may be older than this build. Parsing it through
 * the shared schema turns a contract drift into a handled error instead of a
 * runtime crash.
 */
export async function fetchHealth(
  baseUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ApiResult<HealthResponse>> {
  try {
    const response = await fetchImpl(new URL(healthPath(), baseUrl), {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      return { message: `APIが${response.status}を返しました。`, status: "error" };
    }

    const parsed = healthResponseSchema.safeParse(await response.json());

    if (!parsed.success) {
      return { message: "APIの応答が共有スキーマと一致しません。", status: "error" };
    }

    return { data: parsed.data, status: "ok" };
  } catch {
    return { message: "APIへ接続できませんでした。", status: "error" };
  }
}
