import joi from "joi";

export const addcar = joi.object({
  carbrand: joi.string().min(2).max(100).required().messages({
    "string.base": "Car brand must be a string",
    "string.empty": "Car brand is required",
    "string.min": "Car brand must be at least 2 characters",
    "string.max": "Car brand must not exceed 100 characters",
    "any.required": "Car brand is required",
  }),

  carmodel: joi.string().min(2).max(100).required().messages({
    "string.base": "Car model must be a string",
    "string.empty": "Car model is required",
    "string.min": "Car model must be at least 2 characters",
    "string.max": "Car model must not exceed 100 characters",
    "any.required": "Car model is required",
  }),

  year: joi.number().min(1900).max(2100).required().messages({
    "number.base": "Year must be a number",
    "number.min": "Year must not be less than 1900",
    "number.max": "Year must not exceed 2100",
    "any.required": "Year is required",
  }),

  location: joi.string().required().messages({
    "string.base": "Location must be a string",
    "string.empty": "Location is required",
    "any.required": "Location is required",
  }),

  carname: joi.string().min(2).max(100).required().messages({
    "string.base": "Car name must be a string",
    "string.empty": "Car name is required",
    "string.min": "Car name must be at least 2 characters",
    "string.max": "Car name must not exceed 100 characters",
    "any.required": "Car name is required",
  }),

  carprice: joi.number().min(0).required().messages({
    "number.base": "Car price must be a number",
    "number.min": "Car price cannot be negative",
    "any.required": "Car price is required",
  }),

  distance: joi.string().required().messages({
    "string.base": "Distance must be a string",
    "string.empty": "Distance is required",
    "any.required": "Distance is required",
  }),

  fuel: joi.string().valid("Petrol", "Diesel", "Electric", "Hybrid").messages({
    "any.only": "Fuel must be Petrol, Diesel, Electric, or Hybrid",
  }),

  seatCount: joi.number().valid(4, 5, 7).messages({
    "any.only": "Seat count must be 4, 5, or 7",
  }),
  Body_Type: joi
    .string()
    .valid("Sedan", "SUV", "Hatchback", "Coupe", "Pickup", "Van", "Convertible")
    .messages({
      "any.only":
        "Body type must be Sedan, SUV, Hatchback, Coupe, Pickup, Van, or Convertible",
    }),
  Transmission: joi.string().valid("Automatic", "Manual").messages({
    "any.only": "Transmission must be Automatic or Manual",
  }),
});
