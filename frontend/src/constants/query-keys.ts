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

  ORDERS: {
    ALL: ["orders"] as const,
    DETAILS: (id: string) => ["orders", id] as const,
  },

  BOOKINGS: {
    ALL: ["bookings"] as const,
    DETAILS: (id: string) => ["bookings", id] as const,
  },

  PROFILE: {
    ME: ["profile", "me"] as const,
  },

  NOTIFICATIONS: {
    ALL: ["notifications"] as const,
    UNREAD: ["notifications", "unread"] as const,
  },

  TRADER: {
    OVERVIEW: ["trader", "dashboard", "overview"] as const,
    DASHBOARD_STATS: ["trader", "dashboard", "stats"] as const,
    RECENT_BOOKINGS: ["trader", "dashboard", "recent-bookings"] as const,
    RECENT_ORDERS: ["trader", "dashboard", "recent-orders"] as const,
    RECENT_ACTIVITY: ["trader", "dashboard", "recent-activity"] as const,
    CARS: (type?: string) => ["trader", "cars", { type }] as const,
    BOOKINGS: ["trader", "bookings"] as const,
    ORDERS: ["trader", "orders"] as const,
    CUSTOMERS: ["trader", "customers"] as const,
    REVIEWS: ["trader", "reviews"] as const,
    EARNINGS: ["trader", "earnings"] as const,
  },
} as const;
