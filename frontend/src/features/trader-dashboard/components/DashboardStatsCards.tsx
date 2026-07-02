import { 
  DollarSign, 
  Car, 
  ShoppingCart, 
  CalendarCheck,
  Users,
  Star
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TraderDashboardStats } from "../types";
import { formatDashboardCurrency } from "../utils";

interface DashboardStatsCardsProps {
  stats?: TraderDashboardStats;
  isLoading?: boolean;
}

export function DashboardStatsCards({ stats, isLoading }: DashboardStatsCardsProps) {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard.stats");

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: t("totalRevenue"),
      value: formatDashboardCurrency(stats.totalRevenue, locale),
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: t("activeRentals"),
      value: stats.activeRentalCars.toString(),
      icon: Car,
      color: "text-blue-500",
    },
    {
      title: t("pendingBookings"),
      value: stats.pendingBookings.toString(),
      icon: CalendarCheck,
      color: "text-amber-500",
    },
    {
      title: t("completedOrders"),
      value: stats.completedOrders.toString(),
      icon: ShoppingCart,
      color: "text-purple-500",
    },
    {
      title: t("totalCustomers"),
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "text-pink-500",
    },
    {
      title: t("averageRating"),
      value: t("ratingValue", { value: stats.averageRating }),
      icon: Star,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-slate-400">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950 dark:text-slate-100">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
