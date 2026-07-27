import { AppCard, Badge } from "@ex-foundry/ui";
import { STATUS_LABELS } from "../functions/application-labels";
import type { Application } from "../types/application";

export function ApplicationCard({ application }: { application: Application }) {
  return (
    <AppCard
      badge={
        <Badge variant={application.status === "active" ? "default" : "secondary"}>
          {STATUS_LABELS[application.status]}
        </Badge>
      }
      description={application.description}
      host={application.host}
      href={`https://${application.host}/`}
      name={application.name}
      tags={application.stack}
    />
  );
}
