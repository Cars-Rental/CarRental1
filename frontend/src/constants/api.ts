export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_CODE: "/auth/resend-code",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },

  CARS: {
    ROOT: "/cars",
    RENT: "/cars/rent",
    SALE: "/cars/sale",
    DETAILS: (id: string) => `/cars/${id}`,
  },

  cars: {
    carRent: "/cars/rent",
    carSale: "/cars/sale",
  },

  BOOKINGS: {
    ROOT: "/bookings",
  },

  USERS: {
    PROFILE: "/users/profile",
  },
} as const;