import { useCallback, useMemo } from "react";
import { useNavigation } from "../../../routing/navigation-context";
import { routePath } from "../../../routing/routes";
import {
  parseApplicationSearchParams,
  toApplicationSearchString,
} from "../functions/application-search-params";
import { filterApplications } from "../functions/filter-applications";
import type { Application, CategoryFilterValue } from "../types/application";

/**
 * Holds the filter in the URL so a filtered view can be shared and restored.
 *
 * Updates replace the history entry: typing in the search box should not fill
 * the back button with one entry per keystroke.
 */
export function useApplicationFilter(applications: readonly Application[]) {
  const { location, navigate } = useNavigation();

  const filter = useMemo(() => parseApplicationSearchParams(location.search), [location.search]);

  const visibleApplications = useMemo(
    () => filterApplications(applications, filter),
    [applications, filter],
  );

  const apply = useCallback(
    (next: typeof filter) => {
      navigate(`${routePath("home")}${toApplicationSearchString(next)}`, { replace: true });
    },
    [navigate],
  );

  const setQuery = useCallback((query: string) => apply({ ...filter, query }), [apply, filter]);

  const setCategory = useCallback(
    (category: CategoryFilterValue) => apply({ ...filter, category }),
    [apply, filter],
  );

  return {
    category: filter.category,
    query: filter.query,
    setCategory,
    setQuery,
    visibleApplications,
  };
}
