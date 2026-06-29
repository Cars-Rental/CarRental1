export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFY_EMAIL: "/verify-email",
    RESET_PASSWORD: "/reset-password",
  },

  CARS: {
    ROOT: "/cars",
    RENT: "/cars/carRent",
    SALE: "/cars/carSale",
    DETAILS: (id: string) => `/cars/${id}`,
  },

  BOOKINGS: "/bookings",

  PROFILE: "/profile",

  ORDERS: "/orders",

  FAVORITES: "/favorites",

  SETTINGS: "/settings",

  CHAT: "/chat",

  DASHBOARD: {
    ROOT: "/dashboard",
    OVERVIEW: "/dashboard",
    RENTAL_CARS: "/dashboard/rental-cars",
    SALE_CARS: "/dashboard/sale-cars",
    BOOKINGS: "/dashboard/bookings",
    ORDERS: "/dashboard/orders",
    CUSTOMERS: "/dashboard/customers",
    REVIEWS: "/dashboard/reviews",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
    MESSAGES: "/dashboard/messages",
    ANALYTICS: "/dashboard/analytics",
    EARNINGS: "/dashboard/earnings",
    SETTINGS: "/dashboard/settings",
  },

  ADMIN: {
    ROOT: "/admin",
    OVERVIEW: "/admin",
    USERS: "/admin/users",
    TRADERS: "/admin/traders",
    RENTAL_CARS: "/admin/rental-cars",
    SALE_CARS: "/admin/sale-cars",
    BOOKINGS: "/admin/bookings",
    ORDERS: "/admin/orders",
    REVIEWS: "/admin/reviews",
    REPORTS: "/admin/reports",
    PAYMENTS: "/admin/payments",
    VERIFICATIONS: "/admin/verifications",
    NOTIFICATIONS: "/admin/notifications",
    CATEGORIES: "/admin/categories",
    LOCATIONS: "/admin/locations",
    PROMOTIONS: "/admin/promotions",
    SETTINGS: "/admin/settings",
  },

  NOT_FOUND: "/not-found",
  FOOTER: {},
} as const;
