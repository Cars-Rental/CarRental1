import {
  TraderAuthGuard,
  TraderDashboardLayout,
} from "@/features/trader-dashboard/components";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TraderAuthGuard>
      <TraderDashboardLayout>{children}</TraderDashboardLayout>
    </TraderAuthGuard>
  );
}
