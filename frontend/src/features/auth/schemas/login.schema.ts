import { z } from "zod";

export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .email(t("validation.emailInvalid"))
      .trim(),

    password: z
      .string()
      .min(8, t("validation.passwordMin")),
  });
}

export type LoginSchema = z.infer<
  ReturnType<typeof createLoginSchema>
>;