import { z } from "zod";
import { ROLES } from "@/constants/roles";

export function createRegisterSchema(
  t: (key: string) => string
) {
  return z
    .object({
      userName: z
        .string()
        .trim()
        .min(3, t("validation.userNameMin"))
        .max(30, t("validation.userNameMax")),

      email: z.email(t("validation.emailInvalid")).trim(),

      phone: z
        .string()
        .regex(/^01[0125][0-9]{8}$/, t("validation.phoneInvalid")),

      gender: z.enum(["male", "female"]),

      password: z.string().min(8, t("validation.passwordMin")),

      confirmPassword: z.string(),

      role: z.enum([ROLES.USER, ROLES.TRADER]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation.passwordsNotMatch"),
    });
}

export type RegisterSchema = z.infer<
  ReturnType<typeof createRegisterSchema>
>;