import joi from "joi";
export const register = joi.object({
  userName: joi.string().min(3).max(40).required(),
  email: joi
    .string()
    .email({
      tlds: { allow: ["com", "net"] },
      minDomainSegments: 2,
      maxDomainSegments: 3,
    })
    .required(),
  phone: joi
    .string()
    .pattern(/^01[0125][0-9]{8}$/)
    .required(),
  password: joi
    .string()
    .pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?!.* ).{8,16}$/),
    )
    .required(),
  confirmPassword: joi.string().valid(joi.ref("password")),
  role: joi.string(),
  gender: joi.string(),
});

export const login = joi.object({
  email: joi
    .string()
    .email({
      tlds: { allow: ["com", "net"] },
      minDomainSegments: 2,
      maxDomainSegments: 3,
    })
    .required(),
  password: joi
    .string()
    .pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?!.* ).{8,16}$/),
    )
    .required(),
});
