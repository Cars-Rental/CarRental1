import joi from "joi";
export const addcar = joi.object({
  carbrand: joi.string().min(2).max(100),
  carname: joi.string().min(2).max(100),
  carprice: joi.number().min(100).max(10000),
});
export const updadecar = joi.object({
  id: joi.string().hex().length(24).required(),
  carbrand: joi.string().min(2).max(100),
  carname: joi.string().min(1).max(100),
  carprice: joi.number().min(100).max(10000),
});
