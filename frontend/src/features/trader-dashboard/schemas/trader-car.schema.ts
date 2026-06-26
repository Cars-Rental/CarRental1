import { z } from "zod";

type TraderCarSchemaTranslator = (key: string) => string;

export const createTraderCarSchema = (t: TraderCarSchemaTranslator) =>
  z.object({
    title: z.string().min(3, t("validation.titleMin")),
    brand: z.string().min(1, t("validation.required")),
    model: z.string().min(1, t("validation.required")),
    year: z.number().int().min(1900, t("validation.invalidYear")).max(new Date().getFullYear() + 1, t("validation.invalidYear")),
    type: z.enum(["rent", "sale"] as const),
    price: z.number().positive(t("validation.positivePrice")),
    location: z.string().min(1, t("validation.required")),
    transmission: z.string().min(1, t("validation.required")),
    fuelType: z.string().min(1, t("validation.required")),
    seats: z.number().int().positive(t("validation.positiveSeats")),
    description: z.string().min(10, t("validation.descriptionMin")),
    status: z.enum(["active", "maintenance", "sold", "inactive"] as const),
    images: z.array(z.string()).min(1, t("validation.imagesMin")),
  });

export type TraderCarSchema = z.infer<ReturnType<typeof createTraderCarSchema>>;
