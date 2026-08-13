import { AppCard, Badge } from "@repo/ui";
import { CATEGORY_ICONS } from "../functions/application-icons";
import { STATUS_LABELS } from "../functions/application-labels";
import type { Application } from "../types/application";

export function ApplicationCard({ application }: { application: Application }) {
  const Icon = CATEGORY_ICONS[application.category];

  return (
    <AppCard
      badge={
        <Badge variant={application.status === "active" ? "default" : "secondary"}>
          {STATUS_LABELS[application.status]}
        </Badge>
      }
      description={application.description}
      host={application.host}
      href={`/products/${application.slug}/`}
      mark={<Icon aria-hidden="true" className="size-5" />}
      name={application.name}
      tags={application.stack}
    />
  );
}
