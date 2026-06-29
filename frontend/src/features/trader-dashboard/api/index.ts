import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/constants";
import type { 
  TraderDashboardStats, 
  TraderOverviewResponse,
  TraderDashboardCarsResponse,
  TraderDashboardCarResponseItem,
  TraderDashboardRentOrdersResponse,
  TraderDashboardBuyOrdersResponse,
  TraderDashboardRentOrderItem,
  TraderDashboardBuyOrderItem,
  TraderDashboardCustomersResponse,
  TraderDashboardCustomerItem,
  TraderDashboardEarningsResponse,
  TraderDashboardRecentActivityResponse,
  TraderDashboardActivityItem,
  TraderRecentActivity,
  TraderNotification,
  TraderNotificationsResponse,
  TraderBooking, 
  TraderOrder,
  TraderCar,
  PaginatedResponse,
  CreateTraderCarRequest,
  UpdateTraderCarRequest,
  UpdateBookingStatusRequest,
  UpdateOrderStatusRequest,
  TraderCustomer,
  TraderReview,
  TraderEarnings
} from "../types";
import {
  mockTraderBookings,
  mockTraderCars,
  mockTraderDashboardStats,
  mockTraderOrders,
  mockTraderReviews,
  toMockPaginatedResponse,
} from "../utils";

const USE_MOCK_TRADER_DASHBOARD = true;
const MOCK_DELAY_MS = 250;

const resolveMock = async <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });

const mapDashboardCarStatus = (status?: string): TraderCar["status"] => {
  const normalized = status?.toLowerCase();

  if (normalized === "avilable" || normalized === "available" || normalized === "active") {
    return "active";
  }

  if (normalized === "sold") return "sold";
  if (normalized === "maintenance") return "maintenance";

  return "inactive";
};

const mapDashboardCarToTraderCar = (
  car: TraderDashboardCarResponseItem,
  type: "rent" | "sale"
): TraderCar => ({
  id: car.id,
  title: car.name,
  brand: car.name.split(" ")[0] ?? car.name,
  model: car.model,
  year: car.year,
  image: car.image?.secure_url ?? "",
  images: car.image?.secure_url ? [car.image.secure_url] : [],
  location: car.location,
  type,
  price: car.price,
  salePrice: type === "sale" ? car.price : undefined,
  transmission: car.specs.transmission,
  fuelType: "",
  seats: car.specs.seats,
  status: mapDashboardCarStatus(car.status ?? "active"),
});

const normalizeDashboardStatus = (status: string) => status.toLowerCase();

const mapDashboardRentOrderToTraderBooking = (
  order: TraderDashboardRentOrderItem
): TraderBooking => ({
  id: order.id,
  carId: order.id,
  customerId: order.id,
  startDate: order.startDate,
  endDate: order.endDate,
  totalPrice: order.totalPrice,
  status: normalizeDashboardStatus(order.status) as TraderBooking["status"],
  customerName: order.customer,
  carTitle: order.car,
});

const mapDashboardBuyOrderToTraderOrder = (
  order: TraderDashboardBuyOrderItem
): TraderOrder => ({
  id: order.id,
  carId: order.id,
  customerId: order.id,
  offerPrice: order.carprice,
  status: normalizeDashboardStatus(order.status) as TraderOrder["status"],
  createdAt: order.createdAt,
  customerName: order.customer,
  carTitle: order.car,
});

const mapDashboardCustomerToTraderCustomer = (
  customer: TraderDashboardCustomerItem
): TraderCustomer => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  bookingsCount: 0,
  ordersCount: customer.totalOrders,
  totalSpent: customer.totalSpent,
  status: "active",
});

const mapDashboardEarnings = (
  earnings: TraderDashboardEarningsResponse
): TraderEarnings => ({
  availableBalance: earnings.available,
  pendingBalance: earnings.pending,
  totalEarnings: earnings.total,
  breakdown: earnings.breakdown,
  monthlyBreakdown: earnings.monthlyBreakdown,
});

const mapDashboardActivity = (
  activity: TraderDashboardActivityItem
): TraderRecentActivity => ({
  id: activity._id,
  type: activity.type,
  customerName: activity.user.userName,
  carTitle: activity.car.carname,
  image: activity.car.carimage[0]?.secure_url ?? "",
  amount: activity.totalPrice ?? activity.carprice ?? 0,
  status: normalizeDashboardStatus(activity.status),
  createdAt: activity.createdAt,
});

export const getTraderOverview = async (): Promise<TraderOverviewResponse> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderOverviewResponse;
  }>(API_ENDPOINTS.TRADER.DASHBOARD.OVERVIEW);

  return response.data.data;
};

export const getDashboardStats = async (): Promise<TraderDashboardStats> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(mockTraderDashboardStats);
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.DASHBOARD.STATS);
  return response.data.data;
};

export const getRecentBookings = async (): Promise<TraderBooking[]> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(mockTraderBookings.slice(0, 5));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.DASHBOARD.RECENT_BOOKINGS);
  return response.data.data;
};

export const getRecentOrders = async (): Promise<TraderOrder[]> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(mockTraderOrders.slice(0, 5));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.DASHBOARD.RECENT_ORDERS);
  return response.data.data;
};

export const getTraderCars = async (type?: string): Promise<PaginatedResponse<TraderCar>> => {
  if (type === "rent" || type === "sale") {
    const endpoint =
      type === "rent"
        ? API_ENDPOINTS.TRADER.DASHBOARD.RENT_CARS
        : API_ENDPOINTS.TRADER.DASHBOARD.BUY_CARS;
    const response = await axiosInstance.get<{
      success: boolean;
      data: TraderDashboardCarsResponse;
    }>(
      endpoint
    );
    const cars = response.data.data.cars.map((car) =>
      mapDashboardCarToTraderCar(car, type)
    );

    return {
      data: cars,
      total: response.data.data.total,
      page: response.data.data.page,
      limit: response.data.data.limit,
      totalPages: Math.max(1, Math.ceil(response.data.data.total / response.data.data.limit)),
    };
  }

  if (USE_MOCK_TRADER_DASHBOARD) {
    const cars = type
      ? mockTraderCars.filter((car) => car.type === type)
      : mockTraderCars;

    return resolveMock(toMockPaginatedResponse(cars));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.CARS.GET_ALL, { params: { type } });
  return response.data.data;
};

export const createTraderCar = async (data: CreateTraderCarRequest): Promise<TraderCar> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock({
      ...data,
      id: `mock-car-${Date.now()}`,
      image: data.images[0] ?? "",
    });
  }

  const response = await axiosInstance.post(API_ENDPOINTS.TRADER.CARS.ADD, data);
  return response.data.data;
};

export const updateTraderCar = async ({ id, data }: { id: string; data: UpdateTraderCarRequest }): Promise<TraderCar> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    const currentCar = mockTraderCars.find((car) => car.id === id) ?? mockTraderCars[0];

    return resolveMock({
      ...currentCar,
      ...data,
      id,
      image: data.images?.[0] ?? currentCar.image,
    });
  }

  const response = await axiosInstance.patch(API_ENDPOINTS.TRADER.CARS.UPDATE(id), data);
  return response.data.data;
};

export const deleteTraderCar = async (id: string): Promise<void> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    await resolveMock(id);
    return;
  }

  await axiosInstance.delete(API_ENDPOINTS.TRADER.CARS.DELETE(id));
};

export const getTraderBookings = async (): Promise<PaginatedResponse<TraderBooking>> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderDashboardRentOrdersResponse;
  }>(API_ENDPOINTS.TRADER.DASHBOARD.RENT_ORDERS);
  const orders = response.data.data.orders.map(mapDashboardRentOrderToTraderBooking);

  return {
    data: orders,
    total: response.data.data.total,
    page: response.data.data.page,
    limit: response.data.data.limit,
    totalPages: Math.max(1, Math.ceil(response.data.data.total / response.data.data.limit)),
  };
};

export const updateBookingStatus = async ({ id, data }: { id: string; data: UpdateBookingStatusRequest }): Promise<TraderBooking> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    const booking =
      mockTraderBookings.find((item) => item.id === id) ?? mockTraderBookings[0];

    return resolveMock({ ...booking, status: data.status });
  }

  const response = await axiosInstance.patch(API_ENDPOINTS.TRADER.BOOKINGS.UPDATE_STATUS(id), data);
  return response.data.data;
};

export const getTraderOrders = async (): Promise<PaginatedResponse<TraderOrder>> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderDashboardBuyOrdersResponse;
  }>(API_ENDPOINTS.TRADER.DASHBOARD.BUY_ORDERS);
  const orders = response.data.data.orders.map(mapDashboardBuyOrderToTraderOrder);

  return {
    data: orders,
    total: response.data.data.total,
    page: response.data.data.page,
    limit: response.data.data.limit,
    totalPages: Math.max(1, Math.ceil(response.data.data.total / response.data.data.limit)),
  };
};

export const updateOrderStatus = async ({ id, data }: { id: string; data: UpdateOrderStatusRequest }): Promise<TraderOrder> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    const order =
      mockTraderOrders.find((item) => item.id === id) ?? mockTraderOrders[0];

    return resolveMock({ ...order, status: data.status });
  }

  const response = await axiosInstance.patch(API_ENDPOINTS.TRADER.ORDERS.UPDATE_STATUS(id), data);
  return response.data.data;
};

export const getTraderCustomers = async (): Promise<PaginatedResponse<TraderCustomer>> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderDashboardCustomersResponse;
  }>(API_ENDPOINTS.TRADER.DASHBOARD.CUSTOMERS);
  const customers = response.data.data.customers.map(
    mapDashboardCustomerToTraderCustomer
  );

  return {
    data: customers,
    total: response.data.data.total,
    page: response.data.data.page,
    limit: response.data.data.limit,
    totalPages: Math.max(1, Math.ceil(response.data.data.total / response.data.data.limit)),
  };
};

export const getTraderReviews = async (): Promise<PaginatedResponse<TraderReview>> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(toMockPaginatedResponse(mockTraderReviews));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.REVIEWS);
  return response.data.data;
};

export const getTraderEarnings = async (): Promise<TraderEarnings> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderDashboardEarningsResponse;
  }>(API_ENDPOINTS.TRADER.DASHBOARD.EARNINGS);
  return mapDashboardEarnings(response.data.data);
};

export const getTraderRecentActivity = async (): Promise<TraderRecentActivity[]> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderDashboardRecentActivityResponse;
  }>(API_ENDPOINTS.TRADER.DASHBOARD.RECENT_ACTIVITY);

  return response.data.data.activities.map(mapDashboardActivity);
};

export const getTraderNotifications = async (
  page = 1,
  limit = 20
): Promise<TraderNotificationsResponse> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderNotification[];
    total: number;
    page: number;
    limit: number;
  }>(API_ENDPOINTS.NOTIFICATIONS.ROOT, { params: { page, limit } });

  return {
    notifications: response.data.data,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
};

export const getUnreadTraderNotifications = async (): Promise<{
  notifications: TraderNotification[];
  count: number;
}> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: TraderNotification[];
    count: number;
  }>(API_ENDPOINTS.NOTIFICATIONS.UNREAD);

  return {
    notifications: response.data.data,
    count: response.data.count,
  };
};

export const markTraderNotificationAsRead = async (
  id: string
): Promise<TraderNotification> => {
  const response = await axiosInstance.patch<{
    success: boolean;
    data: TraderNotification;
  }>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));

  return response.data.data;
};

export const markAllTraderNotificationsAsRead = async (): Promise<number> => {
  const response = await axiosInstance.patch<{
    success: boolean;
    updated: number;
  }>(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);

  return response.data.updated;
};
