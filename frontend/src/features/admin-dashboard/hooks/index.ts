import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import * as api from "../api";
import type { AdminListParams } from "../types";
import { ADMIN_DASHBOARD_QUERY_KEYS } from "../utils";

export function useAdminOverview() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview,
    queryFn: api.getAdminOverviewApi,
  });
}

export function useAdminUsers(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.users, params],
    queryFn: () => api.getAdminUsersApi(params),
  });
}

export function useDeleteAdminUser() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteAdminUserApi,
    onSuccess: () => {
      toast.success(t("users.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("users.deleteError"));
    },
  });
}

export function useBanAdminUser() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.banAdminUserApi,
    onSuccess: () => {
      toast.success(t("users.banSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("users.banError"));
    },
  });
}

export function useUnbanAdminUser() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.unbanAdminUserApi,
    onSuccess: () => {
      toast.success(t("users.unbanSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("users.unbanError"));
    },
  });
}

export function useAdminTraders(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.traders, params],
    queryFn: () => api.getAdminTradersApi(params),
  });
}

export function useDeleteAdminTrader() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteAdminTraderApi,
    onSuccess: () => {
      toast.success(t("traders.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.traders });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("traders.deleteError"));
    },
  });
}

export function useBanAdminTrader() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.banAdminTraderApi,
    onSuccess: () => {
      toast.success(t("traders.banSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.traders });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("traders.banError"));
    },
  });
}

export function useUnbanAdminTrader() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.unbanAdminTraderApi,
    onSuccess: () => {
      toast.success(t("traders.unbanSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.traders });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("traders.unbanError"));
    },
  });
}

export function useApproveAdminTrader() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.approveAdminTraderApi,
    onSuccess: () => {
      toast.success(t("traders.approveSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.traders });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("traders.approveError"));
    },
  });
}

export function useAdminCars(
  type: "rent" | "sale",
  params?: AdminListParams,
  enabled = true
) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.cars, type, params],
    queryFn: () => api.getAdminCarsApi(type, params),
    enabled,
  });
}

export function useAdminRentalCar(id: string | null) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.cars, "rent", id],
    queryFn: () => api.getAdminRentalCarByIdApi(id as string),
    enabled: Boolean(id),
  });
}

export function useDeleteAdminRentalCar() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteAdminRentalCarApi,
    onSuccess: () => {
      toast.success(t("cars.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.cars });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("cars.deleteError"));
    },
  });
}

export function useSuspendAdminRentalCar() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.suspendAdminRentalCarApi,
    onSuccess: () => {
      toast.success(t("cars.suspendSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.cars });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("cars.suspendError"));
    },
  });
}

export function useAdminBookings(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.bookings, params],
    queryFn: () => api.getAdminBookingsApi(params),
  });
}

export function useAdminBooking(id: string | null) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.bookings, id],
    queryFn: () => api.getAdminBookingByIdApi(id as string),
    enabled: Boolean(id),
  });
}

export function useCancelAdminBooking() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.cancelAdminBookingApi,
    onSuccess: () => {
      toast.success(t("bookings.cancelSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.bookings });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("bookings.cancelError"));
    },
  });
}

export function useAdminOrders(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.orders, params],
    queryFn: () => api.getAdminOrdersApi(params),
  });
}

export function useAdminOrder(id: string | null) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.orders, id],
    queryFn: () => api.getAdminOrderByIdApi(id as string),
    enabled: Boolean(id),
  });
}

export function useCancelAdminOrder() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.cancelAdminOrderApi,
    onSuccess: () => {
      toast.success(t("orders.cancelSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("orders.cancelError"));
    },
  });
}

export function useAdminReviews(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.reviews, params],
    queryFn: () => api.getAdminReviewsApi(params),
  });
}

export function useDeleteAdminReview() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteAdminReviewApi,
    onSuccess: () => {
      toast.success(t("reviews.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEYS.reviews });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("reviews.deleteError"));
    },
  });
}

export function useAdminReports(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.reports, params],
    queryFn: () => api.getAdminReportsApi(params),
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.payments,
    queryFn: api.getAdminPaymentsApi,
  });
}

export function useAdminVerificationRequests() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.verifications,
    queryFn: api.getAdminVerificationRequestsApi,
  });
}

export function useAdminNotifications(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.notifications, params],
    queryFn: () => api.getAdminNotificationsApi(params),
  });
}

export function useCreateAdminNotification() {
  const t = useTranslations("AdminDashboard");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createAdminNotificationApi,
    onSuccess: () => {
      toast.success(t("notifications.createSuccess"));
      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_QUERY_KEYS.notifications,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("notifications.createError"));
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.categories,
    queryFn: api.getAdminCategoriesApi,
  });
}

export function useAdminLocations() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.locations,
    queryFn: api.getAdminLocationsApi,
  });
}

export function useAdminPromotions() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.promotions,
    queryFn: api.getAdminPromotionsApi,
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateAdminSettingsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_QUERY_KEYS.settings,
      });
    },
  });
}
