import { DashboardStatusBadge } from "@/features/trader-dashboard/components";

export function AdminStatusBadge({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return <DashboardStatusBadge label={label} status={status} />;
}
