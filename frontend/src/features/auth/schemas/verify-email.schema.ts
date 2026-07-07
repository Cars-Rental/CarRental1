import { z } from "zod";

export function createVerifyEmailSchema(t: (key: string) => string) {
  return z.object({
    otp: z
      .string()
      .length(6, t("validation.otpLength"))
      .regex(/^\d+$/, t("validation.otpNumbers")),
  });
}

export type VerifyEmailSchema = z.infer<
  ReturnType<typeof createVerifyEmailSchema>
>;