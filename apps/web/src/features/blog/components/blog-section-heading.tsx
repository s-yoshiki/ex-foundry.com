import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function BlogSectionHeading({
  action,
  as = "h2",
  icon: Icon,
  headingId,
  title,
}: {
  action?: ReactNode;
  as?: "h1" | "h2";
  icon: LucideIcon;
  headingId?: string;
  title: string;
}) {
  const Heading = as;

  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <Heading
        className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        id={headingId}
      >
        <Icon aria-hidden="true" className="size-5 text-primary" />
        {title}
      </Heading>
      {action}
    </div>
  );
}
