import joi from "joi";
export const addcar = joi.object({
  carbrand: joi.string().min(2).max(100).required(),
  carname: joi.string().min(2).max(100).required(),
  carprice: joi.number().min(100).max(10000).required(),
});
export const updadecar = joi.object({
  carbrand: joi.string().min(2).max(100),
  carname: joi.string().min(12).max(100),
  carprice: joi.number().min(100).max(10000),
});
