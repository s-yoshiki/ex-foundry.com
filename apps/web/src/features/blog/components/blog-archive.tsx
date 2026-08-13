import { CalendarDays } from "lucide-react";
import { Link } from "../../../routing/link";
import type { BlogArchiveYear } from "../functions/get-blog-posts";

export function BlogArchive({ archive }: { archive: readonly BlogArchiveYear[] }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      {archive.map((year, index) => (
        <details className="group border-b last:border-0" key={year.year} open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            <span>{year.year}</span>
            <span className="text-xs font-normal text-muted-foreground">{year.count}件</span>
          </summary>
          <ul className="mb-2 grid gap-1 pl-3">
            {year.months.map((month) => (
              <li key={month.month}>
                <Link
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground no-underline hover:bg-muted hover:text-foreground"
                  search={`?year=${year.year}&month=${month.month}`}
                  to="articles"
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays aria-hidden="true" className="size-3.5" />
                    {Number(month.month)}月
                  </span>
                  <span>{month.count}件</span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
