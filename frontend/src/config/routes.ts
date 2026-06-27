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

  DASHBOARD: {
    ROOT: "/dashboard",
    OVERVIEW: "/dashboard",
    RENTAL_CARS: "/dashboard/rental-cars",
    SALE_CARS: "/dashboard/sale-cars",
    BOOKINGS: "/dashboard/bookings",
    ORDERS: "/dashboard/orders",
    CUSTOMERS: "/dashboard/customers",
    REVIEWS: "/dashboard/reviews",
    MESSAGES: "/dashboard/messages",
    ANALYTICS: "/dashboard/analytics",
    EARNINGS: "/dashboard/earnings",
    SETTINGS: "/dashboard/settings",
  },

  NOT_FOUND: "/not-found",
  FOOTER: {},
} as const;
