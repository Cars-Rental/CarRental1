import type { LucideIcon } from "lucide-react";

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-8 text-center dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted dark:bg-slate-800">
        <Icon className="h-6 w-6 text-muted-foreground dark:text-slate-400" />
      </div>
      <h2 className="text-base font-semibold text-foreground dark:text-slate-100">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
