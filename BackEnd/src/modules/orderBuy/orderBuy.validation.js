import joi from "joi";

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  "string.pattern.base": "Must be a valid Mongo ObjectId",
});

export const createOrderBuyValidation = joi.object({
  car: objectId.required().messages({
    "any.required": "Car id is required",
  }),

  notes: joi.string().trim().max(500).optional().messages({
    "string.base": "Notes must be a string",
    "string.max": "Notes must not exceed 500 characters",
  }),
});

export const orderIdParamValidation = joi.object({
  id: objectId.required().messages({
    "any.required": "Order id is required",
  }),
});

export const updateOrderBuyStatusValidation = joi.object({
  id: objectId.required().messages({
    "any.required": "Order id is required",
  }),

  status: joi
    .string()
    .valid("accepted", "rejected", "completed")
    .required()
    .messages({
      "any.only":
        "Status must be accepted, rejected, or completed",
      "any.required": "Status is required",
    }),

  rejectionReason: joi
    .string()
    .trim()
    .when("status", {
      is: "rejected",
      then: joi.required(),
      otherwise: joi.optional(),
    })
    .messages({
      "any.required":
        "Rejection reason is required when status is rejected",
      "string.base": "Rejection reason must be a string",
    }),
});

export const cancelOrderBuyValidation = joi.object({
  id: objectId.required().messages({
    "any.required": "Order id is required",
  }),

  cancellationReason: joi.string().trim().max(500).optional().messages({
    "string.base": "Cancellation reason must be a string",
    "string.max":
      "Cancellation reason must not exceed 500 characters",
  }),
});

export const getOrdersBuyQueryValidation = joi.object({
  page: joi.number().integer().min(1).optional().messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be greater than or equal to 1",
  }),

  limit: joi.number().integer().min(1).max(100).optional().messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be greater than or equal to 1",
    "number.max": "Limit must not exceed 100",
  }),

  status: joi
    .string()
    .valid("pending", "accepted", "rejected", "completed", "cancelled")
    .optional()
    .messages({
      "any.only":
        "Status must be pending, accepted, rejected, completed, or cancelled",
    }),
});