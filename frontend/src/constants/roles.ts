export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  TRADER: "trader",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];