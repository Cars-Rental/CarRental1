"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { QUERY_KEYS, ROLES } from "@/constants";
import { env } from "@/config/env";
import { useAppSelector } from "@/store/hooks";
import { tokenStorage } from "@/features/auth/utils";

import {
  getUnreadNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "../api";
import type { NotificationItem, NotificationsResponse } from "../types";

function upsertNotification(
  notifications: NotificationItem[],
  notification: NotificationItem
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

export function useUserNotifications() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const enabled = isAuthenticated && user?.role === ROLES.USER;

  const unreadQuery = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD,
    queryFn: getUnreadNotificationsApi,
    enabled,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationReadApi,
    onMutate: (notificationId) => {
      queryClient.setQueryData<NotificationsResponse>(
        QUERY_KEYS.NOTIFICATIONS.UNREAD,
        (current) =>
          current
            ? {
                notifications: current.notifications.filter(
                  (item) => item._id !== notificationId
                ),
                count: Math.max(0, current.count - 1),
              }
            : current
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD,
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsReadApi,
    onMutate: () => {
      queryClient.setQueryData<NotificationsResponse>(
        QUERY_KEYS.NOTIFICATIONS.UNREAD,
        (current) =>
          current ? { notifications: [], count: 0 } : current
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD,
      });
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
      queryClient.setQueryData<NotificationsResponse>(
        QUERY_KEYS.NOTIFICATIONS.UNREAD,
        { notifications, count }
      );
    });

    socket.on("new_notification", (notification: NotificationItem) => {
      queryClient.setQueryData<NotificationsResponse>(
        QUERY_KEYS.NOTIFICATIONS.UNREAD,
        (current) =>
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
    });

    socket.on("mark_notification_read", ({ notificationId }) => {
      queryClient.setQueryData<NotificationsResponse>(
        QUERY_KEYS.NOTIFICATIONS.UNREAD,
        (current) =>
          current
            ? {
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
    unreadNotifications: unreadQuery.data?.notifications ?? [],
    unreadCount: unreadQuery.data?.count ?? 0,
    isLoading: unreadQuery.isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}
