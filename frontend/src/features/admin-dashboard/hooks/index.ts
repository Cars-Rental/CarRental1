import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useAdminTraders(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.traders, params],
    queryFn: () => api.getAdminTradersApi(params),
  });
}

export function useAdminCars(type: "rent" | "sale", params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.cars, type, params],
    queryFn: () => api.getAdminCarsApi(type, params),
  });
}

export function useAdminBookings(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.bookings, params],
    queryFn: () => api.getAdminBookingsApi(params),
  });
}

export function useAdminOrders(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.orders, params],
    queryFn: () => api.getAdminOrdersApi(params),
  });
}

export function useAdminReviews(params?: AdminListParams) {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEYS.reviews, params],
    queryFn: () => api.getAdminReviewsApi(params),
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

export function useAdminNotifications() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.notifications,
    queryFn: api.getAdminNotificationsApi,
  });
}

export function useCreateAdminNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAdminNotificationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_QUERY_KEYS.notifications,
      });
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
