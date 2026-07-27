import { z } from "zod";
import { APPLICATION_CATEGORIES, type ApplicationFilter } from "../types/application";

export const QUERY_PARAM = "q";
export const CATEGORY_PARAM = "category";

const MAX_QUERY_LENGTH = 100;

/**
 * Search params are untrusted input: anyone can hand-edit the URL.
 *
 * `catch` turns an unusable value into the default instead of an error, so a
 * malformed link still renders the page. Validating here rather than in the
 * router keeps the rule identical whichever router is mounted.
 */
const searchParamsSchema = z.object({
  [CATEGORY_PARAM]: z.enum(["all", ...APPLICATION_CATEGORIES]).catch("all"),
  [QUERY_PARAM]: z.string().max(MAX_QUERY_LENGTH).catch(""),
});

export function parseApplicationSearchParams(search: string): ApplicationFilter {
  const params = new URLSearchParams(search);
  const parsed = searchParamsSchema.parse({
    [CATEGORY_PARAM]: params.get(CATEGORY_PARAM) ?? "all",
    [QUERY_PARAM]: params.get(QUERY_PARAM) ?? "",
  });

  return { category: parsed[CATEGORY_PARAM], query: parsed[QUERY_PARAM] };
}

/** Serialises a filter, omitting defaults so the clean URL stays clean. */
export function toApplicationSearchString(filter: ApplicationFilter): string {
  const params = new URLSearchParams();

  if (filter.query.trim() !== "") {
    params.set(QUERY_PARAM, filter.query);
  }

  if (filter.category !== "all") {
    params.set(CATEGORY_PARAM, filter.category);
  }

  const search = params.toString();

  return search === "" ? "" : `?${search}`;
}
