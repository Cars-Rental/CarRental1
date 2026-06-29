export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  metadata?: {
    roomId?: string;
    orderId?: string;
    status?: string;
    [key: string]: unknown;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  count: number;
}
