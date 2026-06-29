"use client";

import { Bell, LogOut, Menu, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageToggle, ThemeToggle } from "@/components/shared";
import { useLogout } from "@/features/auth/hooks";

interface AdminTopbarProps {
  isSidebarCollapsed: boolean;
  onMenuClick: () => void;
  onSidebarCollapseClick: () => void;
}

export function AdminTopbar({
  isSidebarCollapsed,
  onMenuClick,
  onSidebarCollapseClick,
}: AdminTopbarProps) {
  const t = useTranslations("AdminDashboard");
  const navT = useTranslations("Navigation");
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("topbar.toggleMenu")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={onSidebarCollapseClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">
            {t(isSidebarCollapsed ? "topbar.expandSidebar" : "topbar.collapseSidebar")}
          </span>
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {t("topbar.title")}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">{t("topbar.notifications")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">{navT("logout")}</span>
        </Button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
