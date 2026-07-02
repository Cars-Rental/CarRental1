import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  active: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  completed: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  pending: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  negotiating: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  maintenance: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  inactive: "bg-muted text-muted-foreground dark:bg-slate-800 dark:text-slate-400",
  sold: "bg-muted text-muted-foreground dark:bg-slate-800 dark:text-slate-400",
  cancelled: "bg-destructive/10 text-destructive dark:bg-rose-500/15 dark:text-rose-300",
  rejected: "bg-destructive/10 text-destructive dark:bg-rose-500/15 dark:text-rose-300",
  failed: "bg-destructive/10 text-destructive dark:bg-rose-500/15 dark:text-rose-300",
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
      : "bg-muted text-muted-foreground dark:bg-slate-800 dark:text-slate-400";

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
