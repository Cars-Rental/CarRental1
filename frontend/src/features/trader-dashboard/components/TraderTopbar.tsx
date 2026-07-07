"use client";

import { useTranslations } from "next-intl";
import { Bell, CheckCheck, LogOut, Menu, User } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageToggle, ThemeToggle } from "@/components/shared";
import { useLogout } from "@/features/auth/hooks";
import { useTraderNotifications } from "../hooks";
import type { TraderNotification } from "../types";

interface TraderTopbarProps {
  onMenuClick?: () => void;
  onSidebarCollapseClick?: () => void;
  isSidebarCollapsed?: boolean;
}

export function TraderTopbar({
  onMenuClick,
  onSidebarCollapseClick,
  isSidebarCollapsed = false,
}: TraderTopbarProps) {
  const t = useTranslations("TraderDashboard");
  const navT = useTranslations("Navigation");
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
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
            {t(
              isSidebarCollapsed
                ? "topbar.expandSidebar"
                : "topbar.collapseSidebar"
            )}
          </span>
        </Button>
        <h2 className="text-lg font-semibold text-foreground dark:text-slate-100">
          {/* We can potentially display the current page title here */}
          {t("sidebar.overview")}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageToggle />

        <TraderNotificationsMenu label={t("topbar.notifications")} />
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5 text-muted-foreground dark:text-slate-400" />
          <span className="sr-only">{navT("logout")}</span>
        </Button>
        
        <div className="flex items-center gap-2 border-l border-border pl-4 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-emerald-400/10">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}

function TraderNotificationsMenu({ label }: { label: string }) {
  const router = useRouter();
  const locale = useLocale();
  const {
    unreadNotifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useTraderNotifications();

  function openNotification(notification: TraderNotification) {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (
      notification.type === "NEW_MESSAGE" &&
      typeof notification.metadata?.roomId === "string"
    ) {
      router.push(
        `/${locale}/dashboard/messages?roomId=${notification.metadata.roomId}`
      );
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md outline-none">
        <span className="relative inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent dark:hover:bg-slate-800">
          <Bell className="h-5 w-5 text-muted-foreground dark:text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">{label}</span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground dark:text-slate-100">{label}</p>
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "No unread notifications"}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs"
            disabled={unreadCount === 0 || isMarkingAllAsRead}
            onClick={() => markAllAsRead()}
          >
            <CheckCheck className="size-4" />
            Read all
          </Button>
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto py-1">
          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground dark:text-slate-400">
              Loading notifications...
            </div>
          ) : unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent focus:bg-accent focus:outline-none dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                onClick={() => openNotification(notification)}
              >
                <span className="mt-1 size-2 rounded-full bg-destructive" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-semibold text-foreground dark:text-slate-100">
                    {notification.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs text-muted-foreground dark:text-slate-400">
                    {notification.message}
                  </span>
                  <span className="mt-2 block text-[11px] text-muted-foreground dark:text-slate-500">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground dark:text-slate-400">
              You are all caught up.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatNotificationTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(timestamp);
}
