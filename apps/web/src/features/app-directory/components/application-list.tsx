import { useMemo } from "react";
import { buildCategoryOptions } from "../functions/application-labels";
import { useApplicationFilter } from "../hooks/use-application-filter";
import { useApplications } from "../hooks/use-applications";
import { ApplicationCard } from "./application-card";
import { ApplicationFilter } from "./application-filter";

export function ApplicationList() {
  const applications = useApplications();
  const { category, query, setCategory, setQuery, visibleApplications } =
    useApplicationFilter(applications);

  const options = useMemo(() => buildCategoryOptions(applications), [applications]);

  return (
    <section aria-labelledby="applications-heading">
      <h2
        className="mb-5 font-mono text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase"
        id="applications-heading"
      >
        アプリケーション
      </h2>

      <ApplicationFilter
        category={category}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
        options={options}
        query={query}
      />

      <p aria-live="polite" className="mb-4 font-mono text-xs text-muted-foreground">
        {visibleApplications.length}件を表示中（全{applications.length}件）
      </p>

      {visibleApplications.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center leading-relaxed text-muted-foreground">
          条件に一致するアプリケーションはありません。検索語やカテゴリを変更してください。
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {visibleApplications.map((application) => (
            <li key={application.host}>
              <ApplicationCard application={application} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
