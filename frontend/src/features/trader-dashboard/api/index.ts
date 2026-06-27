import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/constants";
import type { 
  TraderDashboardStats, 
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
  mockTraderCustomers,
  mockTraderDashboardStats,
  mockTraderEarnings,
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
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(toMockPaginatedResponse(mockTraderBookings));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.BOOKINGS.GET_ALL);
  return response.data.data;
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
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(toMockPaginatedResponse(mockTraderOrders));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.ORDERS.GET_ALL);
  return response.data.data;
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
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(toMockPaginatedResponse(mockTraderCustomers));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.CUSTOMERS);
  return response.data.data;
};

export const getTraderReviews = async (): Promise<PaginatedResponse<TraderReview>> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(toMockPaginatedResponse(mockTraderReviews));
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.REVIEWS);
  return response.data.data;
};

export const getTraderEarnings = async (): Promise<TraderEarnings> => {
  if (USE_MOCK_TRADER_DASHBOARD) {
    return resolveMock(mockTraderEarnings);
  }

  const response = await axiosInstance.get(API_ENDPOINTS.TRADER.EARNINGS);
  return response.data.data;
};
