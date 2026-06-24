import joi from "joi";

export const register = joi.object({
  userName: joi.string().min(3).max(40).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must not exceed 40 characters",
    "any.required": "Username is required",
  }),

  email: joi
    .string()
    .email({
      tlds: { allow: ["com", "net"] },
      minDomainSegments: 2,
      maxDomainSegments: 3,
    })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  phone: joi
    .string()
    .pattern(/^01[0125][0-9]{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid Egyptian phone number",
      "string.empty": "Phone is required",
      "any.required": "Phone is required",
    }),

  password: joi
    .string()
    .pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?!.* ).{8,16}$/),
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
      "any.required": "Password is required",
    }),

  confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
    "any.required": "Confirm password is required",
  }),

  role: joi.string().messages({
    "string.base": "Role must be a string",
  }),

  gender: joi.string().messages({
    "string.base": "Gender must be a string",
  }),
});

export const login = joi.object({
  email: joi
    .string()
    .email({
      tlds: { allow: ["com", "net"] },
      minDomainSegments: 2,
      maxDomainSegments: 3,
    })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  password: joi
    .string()
    .pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?!.* ).{8,16}$/),
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 8-16 chars, include upper, lower, number",
      "any.required": "Password is required",
    }),
});
