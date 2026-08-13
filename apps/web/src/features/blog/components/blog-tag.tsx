import { Link } from "../../../routing/link";

export function BlogTag({ count, name }: { count: number; name: string }) {
  return (
    <Link
      className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs no-underline transition-colors hover:border-foreground/25 hover:bg-muted"
      search={`?tag=${encodeURIComponent(name)}`}
      to="articles"
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      {name}
      <span className="text-muted-foreground">{count}</span>
    </Link>
  );
}
