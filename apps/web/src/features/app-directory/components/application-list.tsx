import { AppCard } from "@ex-foundry/ui";
import { useApplications } from "../hooks/use-applications";

export function ApplicationList() {
  const applications = useApplications();

  return (
    <ul className="app-list">
      {applications.map((application) => (
        <li key={application.host}>
          <AppCard href={`https://${application.host}/`} {...application} />
        </li>
      ))}
    </ul>
  );
}
