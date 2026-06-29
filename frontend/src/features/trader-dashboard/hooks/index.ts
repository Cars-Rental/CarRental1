import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import * as api from "../api";

export function useTraderOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.OVERVIEW,
    queryFn: api.getTraderOverview,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.DASHBOARD_STATS,
    queryFn: api.getDashboardStats,
  });
}

export function useRecentBookings() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.RECENT_BOOKINGS,
    queryFn: api.getRecentBookings,
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.RECENT_ORDERS,
    queryFn: api.getRecentOrders,
  });
}

export function useTraderCars(type?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.CARS(type),
    queryFn: () => api.getTraderCars(type),
  });
}

export function useCreateTraderCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTraderCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader", "cars"] });
    },
  });
}

export function useUpdateTraderCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateTraderCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader", "cars"] });
    },
  });
}

export function useDeleteTraderCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTraderCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader", "cars"] });
    },
  });
}

export function useTraderBookings() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.BOOKINGS,
    queryFn: api.getTraderBookings,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.BOOKINGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.RECENT_BOOKINGS });
    },
  });
}

export function useTraderOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.ORDERS,
    queryFn: api.getTraderOrders,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.RECENT_ORDERS });
    },
  });
}

export function useTraderCustomers() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.CUSTOMERS,
    queryFn: api.getTraderCustomers,
  });
}

export function useTraderReviews() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.REVIEWS,
    queryFn: api.getTraderReviews,
  });
}

export function useTraderEarnings() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.EARNINGS,
    queryFn: api.getTraderEarnings,
  });
}
