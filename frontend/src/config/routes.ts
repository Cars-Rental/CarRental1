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

  DASHBOARD: {
    ROOT: "/dashboard",
    OVERVIEW: "/dashboard",
    CARS: "/dashboard/cars",
    BOOKINGS: "/dashboard/bookings",
    PROFILE: "/dashboard/profile",
  },

  FAVORITES: "/favorites",

  NOT_FOUND: "/not-found",
  FOOTER: {},
} as const;
