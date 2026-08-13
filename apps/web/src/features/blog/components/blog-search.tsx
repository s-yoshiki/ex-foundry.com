import { Search } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigation } from "../../../routing/navigation-context";

export function BlogSearch({ compact = false }: { compact?: boolean }) {
  const { location, navigate } = useNavigation();
  const queryFromUrl = new URLSearchParams(location.search).get("q") ?? "";
  const [query, setQuery] = useState(queryFromUrl);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const queryValue = query.trim();
    navigate(queryValue ? `/articles/?q=${encodeURIComponent(queryValue)}` : "/articles/");
  }

  return (
    <search
      aria-label="記事を検索"
      className={compact ? "relative w-full max-w-sm" : "relative w-full max-w-xl"}
    >
      <form onSubmit={handleSubmit}>
        <Search
          aria-hidden="true"
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          aria-label="記事を検索"
          className="h-9 w-full rounded-full border bg-background px-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="記事を検索"
          type="search"
          value={query}
        />
      </form>
    </search>
  );
}
