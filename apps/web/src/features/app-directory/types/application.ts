export const APPLICATION_CATEGORIES = ["tool", "entertainment", "data"] as const;

export type ApplicationCategory = (typeof APPLICATION_CATEGORIES)[number];

export type ApplicationStatus = "active" | "beta";

export type Application = {
  category: ApplicationCategory;
  description: string;
  host: `${string}.ex-foundry.com`;
  name: string;
  /** Joins this application to its blog posts via `BlogPost.product`. */
  slug: string;
  /** Technologies shown on the card and matched by the search box. */
  stack: readonly string[];
  status: ApplicationStatus;
};

/** `"all"` is the unfiltered pseudo-category used by the category chips. */
export type CategoryFilterValue = ApplicationCategory | "all";

export type ApplicationFilter = {
  category: CategoryFilterValue;
  query: string;
};
