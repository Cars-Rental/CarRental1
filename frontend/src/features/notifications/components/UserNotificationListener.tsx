"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { toast } from "sonner";

import { env } from "@/config/env";
import { ROLES } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { tokenStorage } from "@/features/auth/utils";
import type { Room } from "@/features/chat/types";

interface SocketNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  metadata?: {
    roomId?: string;
    orderId?: string;
    status?: string;
  };
}

const ACCEPTED_NOTIFICATION_TYPES = new Set([
  "ORDER_ACCEPTED",
  "ORDER_BUY_ACCEPTED",
]);

export function UserNotificationListener() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("RealtimeNotifications");
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const latestRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== ROLES.USER) return;

    const token = tokenStorage.getAccessToken();
    if (!token) return;

    const socket = io(env.apiBaseUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("room:created", ({ room }: { room?: Room }) => {
      if (room?._id) {
        latestRoomIdRef.current = room._id;
      }
    });

    socket.on("new_notification", (notification: SocketNotification) => {
      if (!ACCEPTED_NOTIFICATION_TYPES.has(notification.type)) return;

      const roomId = notification.metadata?.roomId ?? latestRoomIdRef.current;
      const isBuyOrder = notification.type === "ORDER_BUY_ACCEPTED";

      toast.success(
        isBuyOrder ? t("buyAcceptedTitle") : t("rentAcceptedTitle"),
        {
          description: isBuyOrder
            ? t("buyAcceptedDescription")
            : t("rentAcceptedDescription"),
          action: roomId
            ? {
                label: t("openChat"),
                onClick: () => router.push(`/${locale}/chat?roomId=${roomId}`),
              }
            : undefined,
        }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, locale, router, t, user]);

  return null;
}
