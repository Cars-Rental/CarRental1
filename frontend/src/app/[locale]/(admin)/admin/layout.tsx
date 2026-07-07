import { AdminDashboardLayout } from "@/features/admin-dashboard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
