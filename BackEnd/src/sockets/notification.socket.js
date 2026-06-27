import { notificationModel } from "../DB/model/notification.model.js";
import { SOCKET_EVENTS } from "./events/events.js";

export const registerNotificationEvents = async (socket) => {
  const userId = socket.user._id.toString();

  // ابعت الإشعارات الغير مقروءة فوراً عند الاتصال
  const unread = await notificationModel
    .find({ recipient: userId, isRead: false })
    .populate("sender", "userName avatar")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  if (unread.length > 0) {
    socket.emit(SOCKET_EVENTS.UNREAD_NOTIFICATIONS, {
      notifications: unread,
      count: unread.length,
    });
  }

  // تعليم إشعار واحد كمقروء عبر Socket
  socket.on(SOCKET_EVENTS.MARK_NOTIFICATION_READ, async ({ notificationId }) => {
    await notificationModel.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true }
    );
    socket.emit(SOCKET_EVENTS.MARK_NOTIFICATION_READ, { notificationId });
  });
};
