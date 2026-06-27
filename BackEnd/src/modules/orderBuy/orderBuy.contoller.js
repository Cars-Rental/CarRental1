import { orderBuyModel } from "../../DB/model/orderBuy.model.js";
import { carbuymodel } from "../../DB/model/carBuy.model.js";
import { createNotification } from "../../services/notification.service.js";
import { NOTIFICATION_TYPES, ENTITY_TYPES } from "../../constants/notification.types.js";
import { roomModel } from "../../DB/model/room.model.js";
import { getSocketIds } from "../../sockets/onlineUsers.js";

const POPULATE_CAR = "carbrand carname carmodel carprice carimage owner quantity status";
const POPULATE_USER = "userName email phone role";

const ORDER_POPULATE = [
  { path: "car", select: POPULATE_CAR },
  { path: "user", select: POPULATE_USER },
  { path: "owner", select: POPULATE_USER },
];

const ALLOWED_STATUS_VALUES = ["pending", "accepted", "rejected", "completed", "cancelled"];
const ALLOWED_TRANSITIONS = {
  pending: ["accepted", "rejected"],
  accepted: ["completed"],
};

export const createOrderBuy = async (req, res, next) => {
  try {
    const { car, notes } = req.body;

    const carObj = await carbuymodel
      .findById(car)
      .select("owner carprice quantity status");

    if (!carObj) {
      return res
        .status(404)
        .json({ success: false, message: "Car not found", data: null });
    }

    if (carObj.status === "sold" || carObj.quantity <= 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Car is sold out",
          data: null,
        });
    }

    if (carObj.owner.toString() === req.user.id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You can't request your own car",
          data: null,
        });
    }

   
    const existingPendingOrder = await orderBuyModel.findOne({
      car,
      user: req.user.id,
      status: "pending",
    });

    if (existingPendingOrder) {
      return res
        .status(409)
        .json({
          success: false,
          message: "You already have a pending request for this car",
          data: null,
        });
    }

    const order = await orderBuyModel.create({
      car,
      user: req.user.id,
      owner: carObj.owner,
      carprice: carObj.carprice,
      notes,
    });

    await order.populate(ORDER_POPULATE);

    await createNotification({
      recipientId: carObj.owner,
      senderId: req.user.id,
      type: NOTIFICATION_TYPES.ORDER_BUY_CREATED,
      title: "طلب شراء جديد",
      message: "أرسل المستخدم طلبًا جديدًا لشراء السيارة",
      entityType: ENTITY_TYPES.ORDER,
      entityId: order._id,
      metadata: { orderId: order._id.toString(), carId: car },
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
  } catch (error) {
    next(error);
  }
};


export const getAllOrdersBuy = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      if (!ALLOWED_STATUS_VALUES.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: `status must be one of: ${ALLOWED_STATUS_VALUES.join(", ")}`,
          data: null,
        });
      }
      filter.status = req.query.status;
    }

    
    if (req.query.userId) {
      filter.user = req.query.userId;
    }

    if (req.query.ownerId) {
      filter.owner = req.query.ownerId;
    }

    const totalOrders = await orderBuyModel.countDocuments(filter);

    const orders = await orderBuyModel
      .find(filter)
      .populate(ORDER_POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      totalOrders,
      page,
      limit,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};



export const getMyOrdersBuy = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const totalOrders = await orderBuyModel.countDocuments(filter);

    const orders = await orderBuyModel
      .find(filter)
      .populate(ORDER_POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res
      .status(200)
      .json({
        success: true,
        message: "My orders fetched successfully",
        totalOrders,
        page,
        limit,
        data: orders,
      });
  } catch (error) {
    next(error);
  }
};


export const getOwnerOrdersBuy = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { owner: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const totalOrders = await orderBuyModel.countDocuments(filter);

    const orders = await orderBuyModel
      .find(filter)
      .populate(ORDER_POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res
      .status(200)
      .json({
        success: true,
        message: "Owner orders fetched successfully",
        totalOrders,
        page,
        limit,
        data: orders,
      });
  } catch (error) {
    next(error);
  }
};

export const getOrderBuyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await orderBuyModel
      .findById(id)
      .populate(ORDER_POPULATE)
      .lean();

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found", data: null });
    }

    const isOwner = order.owner._id.toString() === req.user.id;
    const isCustomer = order.user._id.toString() === req.user.id;

    if (!isOwner && !isCustomer) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to view this order",
          data: null,
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Order fetched successfully",
        data: order,
      });
  } catch (error) {
    next(error);
  }
};

export const updateOrderBuyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status || !ALLOWED_STATUS_VALUES.includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `status must be one of: ${ALLOWED_STATUS_VALUES.join(", ")}`,
          data: null,
        });
    }

    const order = await orderBuyModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found", data: null });
    }

    if (order.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the car owner can update this order",
          data: null,
        });
    }

    const allowedNextStatuses = ALLOWED_TRANSITIONS[order.status] || [];
    if (!allowedNextStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Cannot change order status from "${order.status}" to "${status}"`,
          data: null,
        });
    }

    if (status === "rejected" && !rejectionReason) {
      return res
        .status(400)
        .json({
          success: false,
          message: "rejectionReason is required when rejecting an order",
          data: null,
        });
    }

    if (status === "completed") {
      const carObj = await carbuymodel.findById(order.car);

      if (!carObj) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Car not found, cannot complete order",
            data: null,
          });
      }

      if (carObj.quantity <= 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Car is already sold out",
            data: null,
          });
      }

      carObj.quantity -= 1;
      await carObj.save();
    }
    if (status === "accepted") {
  const io = req.app.get("io");

  let room = await roomModel.findOne({
    type: "private",
    members: { $all: [order.user, order.owner], $size: 2 },
  });

  if (!room) {
    room = await roomModel.create({
      type: "private",
      members: [order.user, order.owner],
    });
  }

  await room.populate("members", "userName email avatar bio isOnline lastSeen");

  if (io) {
    [order.user.toString(), order.owner.toString()].forEach((memberId) => {
      getSocketIds(memberId).forEach((sId) => {
        io.sockets.sockets.get(sId)?.join(room._id.toString());
        io.to(sId).emit("room:created", { room, isNew: true });
      });
    });
  }
}

    order.status = status;
    if (status === "rejected") order.rejectionReason = rejectionReason;

    await order.save();
    await order.populate(ORDER_POPULATE);

    const notificationType =
      status === "accepted"
        ? NOTIFICATION_TYPES.ORDER_BUY_ACCEPTED
        : status === "rejected"
          ? NOTIFICATION_TYPES.ORDER_BUY_REJECTED
          : status === "completed"
            ? NOTIFICATION_TYPES.ORDER_BUY_COMPLETED
            : null;

    if (notificationType) {
      await createNotification({
        recipientId: order.user,
        senderId: req.user.id,
        type: notificationType,
        title: status === "accepted" ? "تم قبول الطلب" : status === "rejected" ? "تم رفض الطلب" : "تم إكمال الطلب",
        message:
          status === "accepted"
            ? "تم قبول طلبك لشراء السيارة"
            : status === "rejected"
              ? "تم رفض طلبك لشراء السيارة"
              : "تم إكمال طلبك لشراء السيارة",
        entityType: ENTITY_TYPES.ORDER,
        entityId: order._id,
        metadata: { orderId: order._id.toString(), status },
      });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: `Order ${status} successfully`,
        data: order,
      });
  } catch (error) {
    next(error);
  }
};


export const cancelOrderBuy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const order = await orderBuyModel.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found", data: null });
    }

    if (order.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to cancel this order",
          data: null,
        });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({
          success: false,
          message: `Cannot cancel an order that is already ${order.status}`,
          data: null,
        });
    }

    order.status = "cancelled";
    if (cancellationReason) order.cancellationReason = cancellationReason;

    await order.save();
    await order.populate(ORDER_POPULATE);

    await createNotification({
      recipientId: order.owner,
      senderId: req.user.id,
      type: NOTIFICATION_TYPES.ORDER_BUY_CANCELLED,
      title: "تم إلغاء طلب الشراء",
      message: "تم إلغاء طلب الشراء من قبل المستخدم",
      entityType: ENTITY_TYPES.ORDER,
      entityId: order._id,
      metadata: { orderId: order._id.toString(), status: order.status },
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
  } catch (error) {
    next(error);
  }
};
