"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import {
  LayoutDashboard,
  Car,
  Tag,
  CalendarDays,
  ShoppingCart,
  Users,
  Star,
  Activity,
  MessageSquare,
  BarChart3,
  Wallet,
  Settings,
} from "lucide-react";

interface TraderSidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

export function TraderSidebar({
  className,
  isCollapsed = false,
}: TraderSidebarProps) {
  const t = useTranslations("TraderDashboard.sidebar");
  const pathname = usePathname();

  const navItems = [
    { href: ROUTES.DASHBOARD.OVERVIEW, label: t("overview"), icon: LayoutDashboard },
    { href: ROUTES.DASHBOARD.RENTAL_CARS, label: t("rentalCars"), icon: Car },
    { href: ROUTES.DASHBOARD.SALE_CARS, label: t("saleCars"), icon: Tag },
    { href: ROUTES.DASHBOARD.BOOKINGS, label: t("bookings"), icon: CalendarDays },
    { href: ROUTES.DASHBOARD.ORDERS, label: t("orders"), icon: ShoppingCart },
    { href: ROUTES.DASHBOARD.CUSTOMERS, label: t("customers"), icon: Users },
    { href: ROUTES.DASHBOARD.REVIEWS, label: t("reviews"), icon: Star },
    { href: ROUTES.DASHBOARD.RECENT_ACTIVITY, label: t("recentActivity"), icon: Activity },
    { href: ROUTES.DASHBOARD.MESSAGES, label: t("messages"), icon: MessageSquare },
    { href: ROUTES.DASHBOARD.ANALYTICS, label: t("analytics"), icon: BarChart3 },
    { href: ROUTES.DASHBOARD.EARNINGS, label: t("earnings"), icon: Wallet },
    { href: ROUTES.DASHBOARD.SETTINGS, label: t("settings"), icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card shadow-sm transition-[width] duration-300",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-border px-6",
          isCollapsed && "justify-center px-3"
        )}
      >
        <Link
          href="/"
          className={cn(
            "text-xl font-bold text-primary transition-all",
            isCollapsed && "text-lg"
          )}
          title="Rento"
        >
          {isCollapsed ? "R" : "Rento"}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname.endsWith(item.href) ||
              (item.href === ROUTES.DASHBOARD.OVERVIEW &&
                pathname.endsWith(ROUTES.DASHBOARD.ROOT));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isCollapsed && "justify-center gap-0 px-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span
                  className={cn(
                    "truncate transition-opacity duration-200",
                    isCollapsed && "sr-only"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
