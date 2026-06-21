import { z } from "zod";

export function createForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z.email(t("validation.emailInvalid")).trim(),
  });
}

export type ForgotPasswordSchema = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;