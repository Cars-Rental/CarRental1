import { z } from "zod";

const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?!.* ).{8,16}$/;

export function createLoginSchema(t: (key: string) => string) {
  return z.object({
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

    password: z
      .string()
      .regex(passwordRegex, t("validation.passwordInvalid")),
  });
}

export type LoginSchema = z.infer<
  ReturnType<typeof createLoginSchema>
>;