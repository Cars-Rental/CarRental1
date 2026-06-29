import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";

import type { NotificationItem, NotificationsResponse } from "./types";

export async function getUnreadNotificationsApi(): Promise<NotificationsResponse> {
  const response = await axiosInstance.get<{
    success: boolean;
    data: NotificationItem[];
    count: number;
  }>(API_ENDPOINTS.NOTIFICATIONS.UNREAD);

  return {
    notifications: response.data.data,
    count: response.data.count,
  };
}

export async function markNotificationReadApi(id: string): Promise<NotificationItem> {
  const response = await axiosInstance.patch<{
    success: boolean;
    data: NotificationItem;
  }>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));

  return response.data.data;
}

export async function markAllNotificationsReadApi(): Promise<number> {
  const response = await axiosInstance.patch<{
    success: boolean;
    updated: number;
  }>(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);

  return response.data.updated;
}
