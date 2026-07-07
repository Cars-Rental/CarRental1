export const USER_ACCOUNT_QUERY_KEYS = {
  profile: ["user-account", "profile"] as const,
  bookings: ["user-account", "bookings"] as const,
  orders: ["user-account", "orders"] as const,
  favorites: ["user-account", "favorites"] as const,
  settings: ["user-account", "settings"] as const,
} as const;
