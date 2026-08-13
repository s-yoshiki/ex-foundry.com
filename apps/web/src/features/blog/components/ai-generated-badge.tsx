import { Bot } from "lucide-react";

export function AiGeneratedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
      <Bot aria-hidden="true" className="size-3" />
      AI補助
    </span>
  );
}
