import { notificationModel } from "../../DB/model/notification.model.js";

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message, data: null });

const ok = (res, status, message, data, extra = {}) =>
  res.status(status).json({ success: true, message, data, ...extra });

// GET /notifications
export const getNotifications = async (req, res, next) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const filter = { recipient: req.user.id };

    const [total, notifications] = await Promise.all([
      notificationModel.countDocuments(filter),
      notificationModel
        .find(filter)
        .populate("sender", "userName avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return ok(res, 200, "Notifications fetched", notifications, { total, page, limit });
  } catch (error) { next(error); }
};

// GET /notifications/unread
export const getUnreadNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationModel
      .find({ recipient: req.user.id, isRead: false })
      .populate("sender", "userName avatar")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return ok(res, 200, "Unread notifications fetched", notifications, {
      count: notifications.length,
    });
  } catch (error) { next(error); }
};

// PATCH /notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationModel.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) return fail(res, 404, "Notification not found");

    return ok(res, 200, "Notification marked as read", notification);
  } catch (error) { next(error); }
};

// PATCH /notifications/read-all
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationModel.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    return ok(res, 200, "All notifications marked as read", null, {
      updated: result.modifiedCount,
    });
  } catch (error) { next(error); }
};

// DELETE /notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await notificationModel.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) return fail(res, 404, "Notification not found");

    return ok(res, 200, "Notification deleted", null);
  } catch (error) { next(error); }
};
