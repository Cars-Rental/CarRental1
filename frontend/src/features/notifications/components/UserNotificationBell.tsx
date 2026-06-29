"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUserNotifications } from "../hooks/useUserNotifications";
import type { NotificationItem } from "../types";

export function UserNotificationBell() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("RealtimeNotifications");
  const {
    unreadNotifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useUserNotifications();

  function openNotification(notification: NotificationItem) {
    markAsRead(notification._id);

    if (typeof notification.metadata?.roomId === "string") {
      router.push(`/${locale}/chat?roomId=${notification.metadata.roomId}`);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md outline-none">
        <span className="relative inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">{t("notifications")}</span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t("notifications")}
            </p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? t("unreadCount", { count: unreadCount })
                : t("noUnread")}
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
            {t("readAll")}
          </Button>
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto py-1">
          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t("loading")}
            </div>
          ) : unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                onClick={() => openNotification(notification)}
              >
                <span className="mt-1 size-2 rounded-full bg-destructive" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-semibold text-foreground">
                    {notification.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </span>
                  <span className="mt-2 block text-[11px] text-muted-foreground">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {t("caughtUp")}
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
