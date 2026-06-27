import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  processing: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  inactive: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
} as const;

type KnownStatus = keyof typeof STATUS_STYLES;

interface UserAccountStatusBadgeProps {
  label: string;
  status: string;
}

export function UserAccountStatusBadge({
  label,
  status,
}: UserAccountStatusBadgeProps) {
  const style =
    status in STATUS_STYLES
      ? STATUS_STYLES[status as KnownStatus]
      : "bg-muted text-muted-foreground";

  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", style)}
    >
      {label}
    </span>
  );
}
