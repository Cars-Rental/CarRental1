export const ROLES = {
  ADMIN: "Admin",
  USER: "User",
  TRADER: "Trader",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];