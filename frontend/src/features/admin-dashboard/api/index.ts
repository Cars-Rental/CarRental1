import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type {
  AdminBooking,
  AdminCar,
  AdminCategoryItem,
  AdminDashboardStats,
  AdminListParams,
  AdminNotification,
  AdminOrder,
  AdminPaymentSummary,
  AdminPromotion,
  AdminReport,
  AdminReview,
  AdminSettings,
  AdminTrader,
  AdminUser,
  AdminVerificationRequest,
  UpdateAdminSettingsRequest,
} from "../types";

const withParams = (params?: AdminListParams) => ({ params });

export async function getAdminOverviewApi(): Promise<AdminDashboardStats> {
  const response =
    await axiosInstance.get<ApiResponse<AdminDashboardStats>>("/admin/overview");
  return response.data.data;
}

export async function getAdminUsersApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminUser[]>>(
    "/admin/users",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminTradersApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminTrader[]>>(
    "/admin/traders",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminCarsApi(type: "rent" | "sale", params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminCar[]>>(
    `/admin/cars/${type}`,
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminBookingsApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminBooking[]>>(
    "/admin/bookings",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminOrdersApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminOrder[]>>(
    "/admin/orders",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminReviewsApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminReview[]>>(
    "/admin/reviews",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminReportsApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminReport[]>>(
    "/admin/reports",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminPaymentsApi() {
  const response =
    await axiosInstance.get<ApiResponse<AdminPaymentSummary>>("/admin/payments");
  return response.data.data;
}

export async function getAdminVerificationRequestsApi() {
  const response = await axiosInstance.get<ApiResponse<AdminVerificationRequest[]>>(
    "/admin/verifications"
  );
  return response.data.data;
}

export async function getAdminNotificationsApi() {
  const response = await axiosInstance.get<ApiResponse<AdminNotification[]>>(
    "/admin/notifications"
  );
  return response.data.data;
}

export async function createAdminNotificationApi(
  data: Omit<AdminNotification, "id" | "createdAt" | "status">
) {
  const response = await axiosInstance.post<ApiResponse<AdminNotification>>(
    "/admin/notifications",
    data
  );
  return response.data.data;
}

export async function getAdminCategoriesApi() {
  const response = await axiosInstance.get<ApiResponse<AdminCategoryItem[]>>(
    "/admin/categories"
  );
  return response.data.data;
}

export async function getAdminLocationsApi() {
  const response = await axiosInstance.get<ApiResponse<AdminCategoryItem[]>>(
    "/admin/locations"
  );
  return response.data.data;
}

export async function getAdminPromotionsApi() {
  const response = await axiosInstance.get<ApiResponse<AdminPromotion[]>>(
    "/admin/promotions"
  );
  return response.data.data;
}

export async function updateAdminSettingsApi(data: UpdateAdminSettingsRequest) {
  const response = await axiosInstance.patch<ApiResponse<AdminSettings>>(
    "/admin/settings",
    data
  );
  return response.data.data;
}
