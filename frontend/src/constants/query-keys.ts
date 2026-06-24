export const QUERY_KEYS = {
  AUTH: {
    USER: ["auth", "user"] as const,
  },

  CARS: {
    ALL: ["cars"] as const,
    RENT: ["cars", "rent"] as const,
    SALE: ["cars", "sale"] as const,
    DETAILS: (id: string) => ["cars", id] as const,
  },

  BOOKINGS: {
    ALL: ["bookings"] as const,
    DETAILS: (id: string) => ["bookings", id] as const,
  },

  PROFILE: {
    ME: ["profile", "me"] as const,
  },
} as const;