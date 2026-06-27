import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  negotiating: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  maintenance: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  inactive: "bg-muted text-muted-foreground",
  sold: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
  failed: "bg-destructive/10 text-destructive",
} as const;

type DashboardStatus = keyof typeof STATUS_STYLES;

interface DashboardStatusBadgeProps {
  status: string;
  label: string;
}

export function DashboardStatusBadge({
  status,
  label,
}: DashboardStatusBadgeProps) {
  const style =
    status in STATUS_STYLES
      ? STATUS_STYLES[status as DashboardStatus]
      : "bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        style
      )}
    >
      {label}
    </span>
  );
}
