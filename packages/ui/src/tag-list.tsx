import { Badge } from "@repo/ui/components/ui/badge";

type TagListProps = {
  items: readonly string[];
  label: string;
};

export function TagList({ items, label }: TagListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul aria-label={label} className="flex list-none flex-wrap gap-1.5 p-0">
      {items.map((item) => (
        <li key={item}>
          <Badge className="font-mono text-muted-foreground" variant="outline">
            {item}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
