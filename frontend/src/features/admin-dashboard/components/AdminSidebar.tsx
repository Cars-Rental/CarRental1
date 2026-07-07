"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Bell,
  CalendarDays,
  Car,
  CreditCard,
  Flag,
  FolderTree,
  Gift,
  LayoutDashboard,
  MapPin,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isCollapsed?: boolean;
}

export function AdminSidebar({ isCollapsed = false }: AdminSidebarProps) {
  const t = useTranslations("AdminDashboard.sidebar");
  const pathname = usePathname();

  const items = [
    { href: ROUTES.ADMIN.OVERVIEW, label: t("overview"), icon: LayoutDashboard },
    { href: ROUTES.ADMIN.USERS, label: t("users"), icon: Users },
    { href: ROUTES.ADMIN.TRADERS, label: t("traders"), icon: Store },
    { href: ROUTES.ADMIN.RENTAL_CARS, label: t("rentalCars"), icon: Car },
    { href: ROUTES.ADMIN.SALE_CARS, label: t("saleCars"), icon: Tag },
    { href: ROUTES.ADMIN.BOOKINGS, label: t("bookings"), icon: CalendarDays },
    { href: ROUTES.ADMIN.ORDERS, label: t("orders"), icon: ShoppingCart },
    { href: ROUTES.ADMIN.REVIEWS, label: t("reviews"), icon: Star },
    { href: ROUTES.ADMIN.REPORTS, label: t("reports"), icon: Flag },
    { href: ROUTES.ADMIN.PAYMENTS, label: t("payments"), icon: CreditCard },
    { href: ROUTES.ADMIN.VERIFICATIONS, label: t("verifications"), icon: ShieldCheck },
    { href: ROUTES.ADMIN.NOTIFICATIONS, label: t("notifications"), icon: Bell },
    { href: ROUTES.ADMIN.CATEGORIES, label: t("categories"), icon: FolderTree },
    { href: ROUTES.ADMIN.LOCATIONS, label: t("locations"), icon: MapPin },
    { href: ROUTES.ADMIN.PROMOTIONS, label: t("promotions"), icon: Gift },
    { href: ROUTES.ADMIN.SETTINGS, label: t("settings"), icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card shadow-sm transition-[width] duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-border px-6",
          isCollapsed && "justify-center px-3"
        )}
      >
        <Link
          href={ROUTES.ADMIN.ROOT}
          className="flex items-center gap-2 text-xl font-bold text-primary"
        >
          <BarChart3 className="h-5 w-5" />
          <span className={cn(isCollapsed && "sr-only")}>Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname.endsWith(item.href) ||
            (item.href === ROUTES.ADMIN.OVERVIEW &&
              pathname.endsWith(ROUTES.ADMIN.ROOT));

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
              <span className={cn("truncate", isCollapsed && "sr-only")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
