import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants";
import { updateBuyOrderStatusApi, updateOrderStatusApi } from "@/features/orders/api";
import * as api from "../api";

export { useTraderNotifications } from "./useTraderNotifications";

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

export function useTraderRecentActivity() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.RECENT_ACTIVITY,
    queryFn: api.getTraderRecentActivity,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
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
  const t = useTranslations("TraderDashboard");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: () => {
      toast.success(t("actions.bookingStatusUpdated"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.BOOKINGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.RECENT_BOOKINGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.RECENT_ACTIVITY });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("actions.bookingStatusUpdateFailed"));
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
  const t = useTranslations("TraderDashboard");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBuyOrderStatusApi,
    onSuccess: () => {
      toast.success(t("actions.orderStatusUpdated"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.RECENT_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRADER.RECENT_ACTIVITY });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("actions.orderStatusUpdateFailed"));
    },
  });
}

export function useTraderCustomers() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.CUSTOMERS,
    queryFn: api.getTraderCustomers,
  });
}

export function useTraderReviews(page = 1, limit = 20) {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.REVIEWS(page, limit),
    queryFn: () => api.getTraderReviews(page, limit),
  });
}

export function useTraderEarnings() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.EARNINGS,
    queryFn: api.getTraderEarnings,
  });
}

export function useTraderAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.ANALYTICS,
    queryFn: api.getTraderAnalytics,
  });
}
