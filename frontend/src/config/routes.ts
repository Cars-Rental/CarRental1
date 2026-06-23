export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  CARS: {
    ROOT: "/cars",
    RENT: "/cars/rent",
    SALE: "/cars/sale",
    DETAILS: (id: string) => `/cars/${id}`,
  },

  BOOKINGS: "/bookings",

  PROFILE: "/profile",

  DASHBOARD: {
    ROOT: "/dashboard",
    CARS: "/dashboard/cars",
    BOOKINGS: "/dashboard/bookings",
    USERS: "/dashboard/users",
  },

  FAVORITES: "/favorites",

  NOT_FOUND: "/not-found",
  FOOTER: {},
} as const;
