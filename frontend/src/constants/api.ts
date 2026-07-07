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
    GOOGLE: "/auth/google",
    DOCUMENT: "/auth/document",
    UPDATE_PROFILE: "/auth/update-profile",
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

  FAVORITES: "/wishlist",
  FAVORITES_ADD: "/wishlist/add",
  FAVORITES_DELETE: (id: string) => `/wishlist/${id}`,

  ORDERS: {
    CREATE: "/orders/create",
    GET_BY_ID: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    DELETE: (id: string) => `/orders/${id}`,
    PAYMENT: "/orders/payment",
  },

  ORDER_BUY: {
    CREATE: "/orderBuy",
    GET_BY_ID: (id: string) => `/orderBuy/${id}`,
    MY_ORDERS: "/orderBuy/my-orders",
    UPDATE_STATUS: (id: string) => `/orderBuy/${id}/status`,
    CANCEL: (id: string) => `/orderBuy/${id}/cancel`,
  },

  BOOKINGS: {
    ROOT: "/bookings",
  },

  NOTIFICATIONS: {
    ROOT: "/notifications",
    UNREAD: "/notifications/unread",
    READ_ALL: "/notifications/read-all",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    DELETE: (id: string) => `/notifications/${id}`,
  },

  USERS: {
    PROFILE: "/users/profile",
  },

  TRADER: {
    DASHBOARD: {
      OVERVIEW: "/dashboard/overview",
      RENT_CARS: "/dashboard/rent-cars",
      BUY_CARS: "/dashboard/buy-cars",
      RENT_ORDERS: "/dashboard/rent-orders",
      BUY_ORDERS: "/dashboard/buy-orders",
      CUSTOMERS: "/dashboard/customers",
      EARNINGS: "/dashboard/earnings",
      RECENT_ACTIVITY: "/dashboard/recent-activity",
      ANALYTICS: "/dashboard/analytics",
      REVIEWS: "/dashboard/reviews",
      STATS: "/trader/dashboard/stats",
      RECENT_BOOKINGS: "/trader/dashboard/recent-bookings",
      RECENT_ORDERS: "/trader/dashboard/recent-orders",
    },
    CARS: {
      GET_ALL: "/trader/cars",
      ADD: "/trader/cars",
      UPDATE: (id: string) => `/trader/cars/${id}`,
      DELETE: (id: string) => `/trader/cars/${id}`,
    },
    BOOKINGS: {
      GET_ALL: "/trader/bookings",
      UPDATE_STATUS: (id: string) => `/trader/bookings/${id}/status`,
    },
    ORDERS: {
      GET_ALL: "/trader/orders",
      UPDATE_STATUS: (id: string) => `/trader/orders/${id}/status`,
    },
    CUSTOMERS: "/trader/customers",
    REVIEWS: "/trader/reviews",
    EARNINGS: "/trader/earnings",
  },
} as const;
