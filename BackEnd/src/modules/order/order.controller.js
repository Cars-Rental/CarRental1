import { orderModel } from "../../DB/model/order.model.js";
import { carModel } from "../../DB/model/car.model.js";

const POPULATE_CAR = "carbrand carname carprice carimage owner isAvailable";
const POPULATE_USER = "userName email phone role";


const ORDER_POPULATE = [
  { path: "car", select: POPULATE_CAR },
  { path: "user", select: POPULATE_USER },
  { path: "owner", select: POPULATE_USER },
];

const ALLOWED_STATUS_VALUES = ["accepted", "rejected", "completed"];


const ALLOWED_TRANSITIONS = {
  pending: ["accepted", "rejected"],
  accepted: ["completed"],
};


const calcTotalDays = (startDate, endDate) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diff = new Date(endDate) - new Date(startDate);
  return Math.max(1, Math.ceil(diff / MS_PER_DAY));
};


export const createOrder = async (req, res, next) => {
  try {
    const {  car, startDate, endDate, notes } = req.body;

    
    if (!startDate || !endDate) {
      return res.status(400).json({success: false,message: "startDate and endDate are required",data: null,});
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({success: false,message: "startDate and endDate must be valid dates",data: null,
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (start < todayStart) {
      return res.status(400).json({success: false,message: "startDate cannot be in the past",data: null,});
    }

    if (start >= end) {
      return res.status(400).json({   success: false,message: "startDate must be earlier than endDate",data: null,});
    }
   
    const Carobj = await carModel
      .findById(car)
      .select("owner isAvailable carprice");
     
    if (!Carobj) {
      return res.status(404).json({ success: false,message: "Car not found",data: null,
      });
    }

    if (Carobj.isAvailable) {
      return res.status(400).json({   success: false,message: "Car is not available for booking",data: null,});
    }
    if (Carobj.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false,message: "You can't book your own car",data: null,});
    }

   
    const overlappingOrder = await orderModel.findOne({
      car,
      status: { $in: ["pending", "accepted"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });
    console.log(overlappingOrder)
    if (overlappingOrder) {
      return res.status(409).json({success: false,message: "Car is already booked for the selected dates",data: null,});
    }

    const totalDays = calcTotalDays(start, end);
    const totalPrice =Number(totalDays * Carobj.carprice);


    const order = await orderModel.create({
      car,
      user: req.user.id,
      owner: Carobj.owner,
      startDate: start,
      endDate: end,
      totalDays,
      priceperDay: Carobj.carprice, 
      totalPrice,
      notes,
    });

    await order.populate(ORDER_POPULATE);

    return res.status(201).json({ success: true,message: "Order created successfully",data: order,});
  } catch (error) {
    next(error);
  }
};


export const getMyOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const totalOrders = await orderModel.countDocuments(filter);

    const orders = await orderModel
      .find(filter)
      .populate(ORDER_POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); 

    return res.status(200).json({ success: true,message: "My orders fetched successfully",totalOrders,page,limit,data: orders,});
  } catch (error) {
    next(error);
  }
};


export const getOwnerOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = { owner: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const totalOrders = await orderModel.countDocuments(filter);

    const orders = await orderModel
      .find(filter)
      .populate(ORDER_POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({ success: true,message: "Owner orders fetched successfully",totalOrders,page,limit,data: orders,});
  } catch (error) {
    next(error);
  }
};


export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await orderModel
      .findById(id)
      .populate(ORDER_POPULATE)
      .lean();

    if (!order) {
      return res.status(404).json({success: false,message: "Order not found",data: null,});
    }

    const isOwner = order.owner._id.toString() === req.user.id;
    const isCustomer = order.user._id.toString() === req.user.id;

    if (!isOwner && !isCustomer) {
      return res.status(403).json({success: false,message: "You are not authorized to view this order",data: null,});
    }

    return res.status(200).json({success: true,message: "Order fetched successfully",data: order,});
  } catch (error) {
    next(error);
  }
};


export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
   
    if (!status || !ALLOWED_STATUS_VALUES.includes(status)) {
      return res.status(400).json({success: false,message: `status must be one of: ${ALLOWED_STATUS_VALUES.join(", ")}`,data: null,
      });
    }

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }
    if (order.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the car owner can update this order",
        data: null,
      });
    }
   
    const allowedNextStatuses = ALLOWED_TRANSITIONS[order.status] || [];
    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({success: false,message: `Cannot change order status from "${order.status}" to "${status}"`,data: null,
      });
    }

    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({success: false,message: "rejectionReason is required when rejecting an order",data: null,});
    }

    order.status = status;
    if (status === "rejected") order.rejectionReason = rejectionReason;

    await order.save();
    await order.populate(ORDER_POPULATE);

    return res.status(200).json({ success: true,message: `Order ${status} successfully`,data: order,});
  } catch (error) {
    next(error);
  }
};


export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({success: false,message: "Order not found", data: null,});
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({success: false,message: "You are not authorized to cancel this order",data: null,});
    }

    if (order.status !== "pending") {
      return res.status(400).json({ success: false,message: `Cannot cancel an order that is already ${order.status}`,data: null,});
    }

    
    order.status = "cancelled";
    if (cancellationReason) order.cancellationReason = cancellationReason;

    await order.save();
    await order.populate(ORDER_POPULATE)

    return res.status(200).json({ success: true,message: "Order cancelled successfully",data: order,});
  } catch (error) {
    next(error);
  }
};