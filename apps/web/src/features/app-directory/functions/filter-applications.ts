import type { Application, ApplicationFilter } from "../types/application";

function buildHaystack(application: Application): string {
  return [application.name, application.description, application.host, ...application.stack]
    .join(" ")
    .toLowerCase();
}

function matchesQuery(application: Application, terms: readonly string[]): boolean {
  if (terms.length === 0) {
    return true;
  }

  const haystack = buildHaystack(application);

  return terms.every((term) => haystack.includes(term));
}

/** Splits a raw query into lowercase terms, dropping surrounding whitespace. */
export function toSearchTerms(query: string): readonly string[] {
  const normalized = query.trim().toLowerCase();

  return normalized === "" ? [] : normalized.split(/\s+/);
}

export function filterApplications(
  applications: readonly Application[],
  filter: ApplicationFilter,
): readonly Application[] {
  const terms = toSearchTerms(filter.query);

  return applications.filter(
    (application) =>
      (filter.category === "all" || application.category === filter.category) &&
      matchesQuery(application, terms),
  );
}
