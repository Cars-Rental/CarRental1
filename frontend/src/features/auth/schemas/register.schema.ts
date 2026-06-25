import { z } from "zod";
import { ROLES } from "@/constants/roles";
import { GENDERS } from "@/constants";

const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?!.* ).{8,16}$/;

const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

export function createRegisterSchema(
  t: (key: string) => string
) {
  return z
    .object({
      userName: z
        .string()
        .trim()
        .min(3, t("validation.userNameMin"))
        .max(40, t("validation.userNameMax")),

      email: z
        .email(t("validation.emailInvalid"))
        .trim()
        .refine(
          (email) => {
            const domain = email.split("@")[1];
            const parts = domain?.split(".") ?? [];
            const tld = parts.at(-1);

            return (
              ["com", "net"].includes(tld ?? "") &&
              parts.length >= 2 &&
              parts.length <= 3
            );
          },
          {
            message: t("validation.emailInvalid"),
          }
        ),

      phone: z
        .string()
        .regex(egyptPhoneRegex, t("validation.phoneInvalid")),

      gender: z.enum([GENDERS.MALE, GENDERS.FEMALE]),

      password: z
        .string()
        .regex(passwordRegex, t("validation.passwordInvalid")),

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