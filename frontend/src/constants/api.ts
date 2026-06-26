export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logoutt",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_CODE: "/auth/resend-code",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },

  CARS: {
    RENT: {
      GET_ALL_RENT: "/cars/getallcar",
      ADD_RENT: "/cars/addcars",
      GET_RENT_BY_ID: (id: string) => `/cars/getbyid/${id}`,
      UPDATE_RENT: (id: string) => `/cars/update/${id}`,
      DELETE_RENT: (id: string) => `/cars/delete/${id}`,
    },
    SALE: {
      GET_ALL_SALE: "/carbuy/getall",
      ADD_SALE: "/carbuy/addcar",
      GET_SALE_BY_ID: (id: string) => `/carbuy/getbyid/${id}`,
      UPDATE_SALE: (id: string) => `/carbuy/updatecar/${id}`,
      DELETE_SALE: (id: string) => `/carbuy/deletecar/${id}`,
    },
  },

  BOOKINGS: {
    ROOT: "/bookings",
  },

  USERS: {
    PROFILE: "/users/profile",
  },
} as const;
