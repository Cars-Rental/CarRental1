import Joi from "joi";

const objectId = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message("invalid id format");


export const createOrderSchema = Joi.object({
  car: objectId.required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  notes: Joi.string().max(300).allow("", null),
});

export const updateOrderStatusSchema = Joi.object({
  id: objectId.required(), 
  status: Joi.string().required(),
  rejectionReason: Joi.string().max(300).allow("", null),
});


export const cancelOrderSchema = Joi.object({
  id: objectId.required(),
  cancellationReason: Joi.string().max(300).allow("", null),
});


export const getOrderByIdSchema = Joi.object({
  id: objectId.required(),
});


export const listOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid(
    "pending",
    "accepted",
    "rejected",
    "completed",
    "cancelled"
  ),
});