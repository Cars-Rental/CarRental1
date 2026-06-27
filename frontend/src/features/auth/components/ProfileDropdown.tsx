"use client";

import {
  CalendarCheck,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { ROLES } from "@/constants";
import { useAppSelector } from "@/store/hooks";

import { useLogout } from "../hooks";

export function ProfileDropdown() {
  const t = useTranslations("Navigation");
  const user = useAppSelector((state) => state.auth.user);
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  const initials =
    user.userName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const accountLinks = [
    {
      label: t("profile"),
      href: ROUTES.PROFILE,
      icon: User,
    },
    {
      label: t("bookings"),
      href: ROUTES.BOOKINGS,
      icon: CalendarCheck,
    },
    {
      label: t("orders"),
      href: ROUTES.ORDERS,
      icon: Package,
    },
    {
      label: t("favorites"),
      href: ROUTES.FAVORITES,
      icon: Heart,
    },
    {
      label: t("settings"),
      href: ROUTES.SETTINGS,
      icon: Settings,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-10 rounded-full outline-none">
        <span className="inline-flex h-10 items-center gap-2 rounded-full px-2 transition-colors hover:bg-accent">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initials}
          </span>

          <span className="hidden max-w-28 truncate text-sm font-semibold md:block">
            {user.userName}
          </span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.userName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {user.role === ROLES.TRADER ? (
          <Link href={ROUTES.DASHBOARD.ROOT}>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <LayoutDashboard className="size-4" />
              <span>{t("dashboard")}</span>
            </DropdownMenuItem>
          </Link>
        ) : (
          accountLinks.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Icon className="size-4" />
                <span>{label}</span>
              </DropdownMenuItem>
            </Link>
          ))
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isPending}
          variant="destructive"
          className="cursor-pointer gap-2"
        >
          <LogOut className="size-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
