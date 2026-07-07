import { z } from "zod";

type Translator = (key: string) => string;

export const createAdminNotificationSchema = (t: Translator) =>
  z.object({
    title: z.string().min(2, t("validation.required")),
    message: z.string().min(5, t("validation.required")),
    audience: z.enum(["all", "users", "traders"]),
  });

export const createAdminNamedItemSchema = (t: Translator) =>
  z.object({
    name: z.string().min(2, t("validation.required")),
    status: z.enum(["active", "inactive"]),
  });

export const createAdminSettingsSchema = (t: Translator) =>
  z.object({
    general: z.string().min(1, t("validation.required")),
    platform: z.string().min(1, t("validation.required")),
    security: z.string().min(1, t("validation.required")),
    email: z.string().email(t("validation.email")),
    notifications: z.string().min(1, t("validation.required")),
    payments: z.string().min(1, t("validation.required")),
    commission: z.string().min(1, t("validation.required")),
    localization: z.string().min(1, t("validation.required")),
  });

export type AdminNotificationSchema = z.infer<
  ReturnType<typeof createAdminNotificationSchema>
>;
export type AdminNamedItemSchema = z.infer<
  ReturnType<typeof createAdminNamedItemSchema>
>;
export type AdminSettingsSchema = z.infer<
  ReturnType<typeof createAdminSettingsSchema>
>;
