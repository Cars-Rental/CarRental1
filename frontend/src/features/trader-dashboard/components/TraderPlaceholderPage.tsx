import type { LucideIcon } from "lucide-react";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";

interface TraderPlaceholderPageProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
}

export function TraderPlaceholderPage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon,
}: TraderPlaceholderPageProps) {
  return (
    <div>
      <DashboardPageHeader title={title} description={description} />
      <DashboardEmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
      />
    </div>
  );
}
