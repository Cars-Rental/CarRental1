import { notificationModel } from "../DB/model/notification.model.js";
import { getSocketIds } from "../sockets/onlineUsers.js";

let _io = null;

export const initNotificationService = (io) => {
  _io = io;
};

/**
 * createNotification — يُستخدم من أي موديول
 * يحفظ في الداتابيز + يبعت real-time لو المستخدم أونلاين
 */
export const createNotification = async ({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  entityType,
  entityId,
  metadata = {},
}) => {
  const notification = await notificationModel.create({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    message,
    entityType,
    entityId,
    metadata,
  });

  if (_io) {
    const socketIds = getSocketIds(recipientId.toString());
    const payload = {
      _id: notification._id,
      type,
      title,
      message,
      entityType,
      entityId,
      metadata,
      isRead: false,
      createdAt: notification.createdAt,
    };

    socketIds.forEach((socketId) => {
      _io.to(socketId).emit("new_notification", payload);
    });
  }

  return notification;
};
