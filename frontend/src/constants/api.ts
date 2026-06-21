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
    DETAILS: (id: string) => `/cars/${id}`,
  },

  BOOKINGS: {
    ROOT: "/bookings",
  },

  USERS: {
    PROFILE: "/users/profile",
  },
} as const;