import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const registerSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username is too long"),

    email: z.email("Please enter a valid email").trim(),

    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),

    gender: z.enum(["male", "female"]),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),

    role: z.enum([ROLES.USER, ROLES.TRADER]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;