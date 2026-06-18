export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
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