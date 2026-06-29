"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { QUERY_KEYS } from "@/constants";
import { env } from "@/config/env";
import { useAppSelector } from "@/store/hooks";
import { tokenStorage } from "@/features/auth/utils";

import * as api from "../api";
import type {
  TraderNotification,
  TraderNotificationsResponse,
} from "../types";

const unreadKey = QUERY_KEYS.NOTIFICATIONS.UNREAD;
const allKey = QUERY_KEYS.NOTIFICATIONS.ALL;

interface UnreadTraderNotifications {
  notifications: TraderNotification[];
  count: number;
}

function upsertNotification(
  notifications: TraderNotification[],
  notification: TraderNotification
) {
  const exists = notifications.some((item) => item._id === notification._id);
  const next = exists
    ? notifications.map((item) =>
        item._id === notification._id ? { ...item, ...notification } : item
      )
    : [notification, ...notifications];

  return next.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function useTraderNotifications() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const enabled = isAuthenticated && user?.role === "Trader";

  const unreadQuery = useQuery({
    queryKey: unreadKey,
    queryFn: api.getUnreadTraderNotifications,
    enabled,
  });

  const notificationsQuery = useQuery({
    queryKey: allKey,
    queryFn: () => api.getTraderNotifications(),
    enabled,
  });

  const markAsReadMutation = useMutation({
    mutationFn: api.markTraderNotificationAsRead,
    onMutate: async (notificationId) => {
      queryClient.setQueryData<UnreadTraderNotifications>(unreadKey, (current) =>
        current
          ? {
              ...current,
              notifications: current.notifications.filter(
                (item) => item._id !== notificationId
              ),
              count: Math.max(0, current.count - 1),
            }
          : current
      );

      queryClient.setQueryData<TraderNotificationsResponse>(
        allKey,
        (current) =>
          current
            ? {
                ...current,
                notifications: current.notifications.map((item) =>
                  item._id === notificationId
                    ? { ...item, isRead: true }
                    : item
                ),
              }
            : current
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: unreadKey });
      queryClient.invalidateQueries({ queryKey: allKey });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: api.markAllTraderNotificationsAsRead,
    onMutate: async () => {
      queryClient.setQueryData<UnreadTraderNotifications>(unreadKey, (current) =>
        current ? { ...current, notifications: [], count: 0 } : current
      );

      queryClient.setQueryData<TraderNotificationsResponse>(
        allKey,
        (current) =>
          current
            ? {
                ...current,
                notifications: current.notifications.map((item) => ({
                  ...item,
                  isRead: true,
                })),
              }
            : current
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: unreadKey });
      queryClient.invalidateQueries({ queryKey: allKey });
    },
  });

  useEffect(() => {
    if (!enabled) return;

    const token = tokenStorage.getAccessToken();
    if (!token) return;

    const socket = io(env.apiBaseUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("unread_notifications", ({ notifications, count }) => {
      queryClient.setQueryData<UnreadTraderNotifications>(unreadKey, {
        notifications,
        count,
      });
    });

    socket.on("new_notification", (notification: TraderNotification) => {
      queryClient.setQueryData<UnreadTraderNotifications>(unreadKey, (current) =>
        current
          ? {
              notifications: upsertNotification(
                current.notifications,
                notification
              ),
              count: current.notifications.some(
                (item) => item._id === notification._id
              )
                ? current.count
                : current.count + 1,
            }
          : { notifications: [notification], count: 1 }
      );

      queryClient.setQueryData<TraderNotificationsResponse>(
        allKey,
        (current) =>
          current
            ? {
                ...current,
                notifications: upsertNotification(
                  current.notifications,
                  notification
                ),
                total: current.notifications.some(
                  (item) => item._id === notification._id
                )
                  ? current.total
                  : current.total + 1,
              }
            : current
      );
    });

    socket.on("mark_notification_read", ({ notificationId }) => {
      queryClient.setQueryData<UnreadTraderNotifications>(unreadKey, (current) =>
        current
          ? {
              ...current,
              notifications: current.notifications.filter(
                (item) => item._id !== notificationId
              ),
              count: Math.max(0, current.count - 1),
            }
          : current
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [enabled, queryClient]);

  return {
    notifications: notificationsQuery.data?.notifications ?? [],
    unreadNotifications: unreadQuery.data?.notifications ?? [],
    unreadCount: unreadQuery.data?.count ?? 0,
    isLoading: unreadQuery.isLoading || notificationsQuery.isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}
