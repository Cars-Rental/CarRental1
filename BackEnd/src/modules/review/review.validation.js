import Joi from "joi";

export const createReviewSchema = Joi.object({
  carRent: Joi.string()
    .required()
    .messages({
      "string.empty": " Car Rent ID مطلوب",
      "any.required": " Car Rent ID مطلوب",
    }),
  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": " Rating يجب أن يكون رقم",
      "number.min": " Rating يجب أن يكون من 1 إلى 5",
      "number.max": " Rating يجب أن يكون من 1 إلى 5",
      "any.required": " Rating مطلوب",
    }),
  comment: Joi.string()
    .max(1000)
    .optional()
    .messages({
      "string.max": " Comment لا يزيد عن 1000 حرف",
    }),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .messages({
      "number.base": " Rating يجب أن يكون رقم",
      "number.min": " Rating يجب أن يكون من 1 إلى 5",
      "number.max": " Rating يجب أن يكون من 1 إلى 5",
    }),
  comment: Joi.string()
    .max(1000)
    .optional()
    .messages({
      "string.max": " Comment لا يزيد عن 1000 حرف",
    }),
}).min(1).messages({
  "object.min": " يجب تحديث حاجة واحد على الأقل",
});