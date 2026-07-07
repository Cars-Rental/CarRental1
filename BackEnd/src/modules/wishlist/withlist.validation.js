import Joi from "joi";

export const addToWishlistSchema = Joi.object({
  carId: Joi.string().hex().length(24).required(),

  carModel: Joi.string().valid("carRent", "carBuy").required(),
});
export const removeWishlistSchema = Joi.object({
  carId: Joi.string().hex().length(24).required(),
});
