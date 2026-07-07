import joi from "joi";

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  "string.pattern.base": "Invalid id format",
});

export const createOrderSchema = joi.object({
  car: objectId.required().messages({
    "any.required": "Car id is required",
  }),

  startDate: joi.date().iso().required().messages({
    "date.base": "Start date must be a valid date",
    "any.required": "Start date is required",
  }),

  endDate: joi.date().iso().required().messages({
    "date.base": "End date must be a valid date",
    "any.required": "End date is required",
  }),

  notes: joi.string().max(300).allow("", null).messages({
    "string.max": "Notes must not exceed 300 characters",
  }),
});

export const updateOrderStatusSchema = joi.object({
  id: objectId.required().messages({
    "any.required": "Order id is required",
  }),

  status: joi
    .string()
    .valid("pending", "accepted", "rejected", "completed", "cancelled")
    .required()
    .messages({
      "any.only":
        "Status must be pending, accepted, rejected, completed, or cancelled",
      "any.required": "Status is required",
    }),

  rejectionReason: joi.string().max(300).allow("", null).messages({
    "string.max": "Rejection reason must not exceed 300 characters",
  }),
});

export const cancelOrderSchema = joi.object({
  id: objectId.required().messages({
    "any.required": "Order id is required",
  }),

  cancellationReason: joi.string().max(300).allow("", null).messages({
    "string.max": "Cancellation reason must not exceed 300 characters",
  }),
});

export const getOrderByIdSchema = joi.object({
  id: objectId.required().messages({
    "any.required": "Order id is required",
  }),
});

export const listOrdersSchema = joi.object({
  page: joi.number().integer().min(1).default(1).messages({
    "number.integer": "Page must be an integer",
    "number.min": "Page must be greater than 0",
  }),

  limit: joi.number().integer().min(1).max(100).default(20).messages({
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be greater than 0",
    "number.max": "Limit must not exceed 100",
  }),

  status: joi
    .string()
    .valid("pending", "accepted", "rejected", "completed", "cancelled")
    .messages({
      "any.only":
        "Status must be pending, accepted, rejected, completed, or cancelled",
    }),
});