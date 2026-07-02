import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type {
  AdminBookingDetail,
  AdminBookingsResponse,
  AdminCarDetail,
  AdminCarsResponse,
  AdminCategoryItem,
  AdminOverviewResponse,
  AdminListParams,
  AdminNotificationsResponse,
  AdminOrderDetail,
  AdminOrdersResponse,
  AdminPaymentSummary,
  AdminPromotion,
  AdminReport,
  AdminReviewsResponse,
  AdminSettings,
  AdminTrader,
  AdminTradersResponse,
  AdminUser,
  AdminUsersResponse,
  AdminVerificationRequest,
  CreateAdminNotificationRequest,
  UpdateAdminSettingsRequest,
} from "../types";

const withParams = (params?: AdminListParams) => ({ params });

export async function getAdminOverviewApi(): Promise<AdminOverviewResponse> {
  const response =
    await axiosInstance.get<ApiResponse<AdminOverviewResponse>>("/admin/overview");
  return response.data.data;
}

export async function getAdminUsersApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminUsersResponse>>(
    "/admin/users",
    withParams(params)
  );
  return response.data.data;
}

export async function deleteAdminUserApi(id: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(`/admin/users/${id}`);
}

export async function banAdminUserApi(id: string): Promise<AdminUser> {
  const response = await axiosInstance.patch<ApiResponse<AdminUser>>(
    `/admin/users/${id}/ban`
  );
  return response.data.data;
}

export async function unbanAdminUserApi(id: string): Promise<AdminUser> {
  const response = await axiosInstance.patch<ApiResponse<AdminUser>>(
    `/admin/users/${id}/unban`
  );
  return response.data.data;
}

export async function getAdminTradersApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminTradersResponse>>(
    "/admin/traders",
    withParams(params)
  );
  return response.data.data;
}

export async function deleteAdminTraderApi(id: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(`/admin/traders/${id}`);
}

export async function banAdminTraderApi(id: string): Promise<AdminTrader> {
  const response = await axiosInstance.patch<ApiResponse<AdminTrader>>(
    `/admin/traders/${id}/ban`
  );
  return response.data.data;
}

export async function unbanAdminTraderApi(id: string): Promise<AdminTrader> {
  const response = await axiosInstance.patch<ApiResponse<AdminTrader>>(
    `/admin/traders/${id}/unban`
  );
  return response.data.data;
}

export async function approveAdminTraderApi(id: string): Promise<AdminTrader> {
  const response = await axiosInstance.patch<ApiResponse<AdminTrader>>(
    `/admin/traders/${id}/approve`
  );
  return response.data.data;
}

export async function getAdminCarsApi(type: "rent" | "sale", params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminCarsResponse>>(
    `/admin/cars/${type}`,
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminRentalCarByIdApi(id: string): Promise<AdminCarDetail> {
  const response = await axiosInstance.get<ApiResponse<AdminCarDetail>>(
    `/admin/cars/rent/${id}`
  );
  return response.data.data;
}

export async function deleteAdminRentalCarApi(id: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(`/admin/cars/rent/${id}`);
}

export async function suspendAdminRentalCarApi(
  id: string
): Promise<AdminCarDetail> {
  const response = await axiosInstance.patch<ApiResponse<AdminCarDetail>>(
    `/admin/cars/rent/${id}/suspend`
  );
  return response.data.data;
}

export async function getAdminBookingsApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminBookingsResponse>>(
    "/admin/bookings",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminBookingByIdApi(id: string): Promise<AdminBookingDetail> {
  const response = await axiosInstance.get<ApiResponse<AdminBookingDetail>>(
    `/admin/bookings/${id}`
  );
  return response.data.data;
}

export async function cancelAdminBookingApi(id: string): Promise<AdminBookingDetail> {
  const response = await axiosInstance.patch<ApiResponse<AdminBookingDetail>>(
    `/admin/bookings/${id}/cancel`
  );
  return response.data.data;
}

export async function getAdminOrdersApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminOrdersResponse>>(
    "/admin/orders",
    withParams(params)
  );
  return response.data.data;
}

export async function getAdminOrderByIdApi(id: string): Promise<AdminOrderDetail> {
  const response = await axiosInstance.get<ApiResponse<AdminOrderDetail>>(
    `/admin/orders/${id}`
  );
  return response.data.data;
}

export async function cancelAdminOrderApi(id: string): Promise<AdminOrderDetail> {
  const response = await axiosInstance.patch<ApiResponse<AdminOrderDetail>>(
    `/admin/orders/${id}/cancel`
  );
  return response.data.data;
}

export async function getAdminReviewsApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminReviewsResponse>>(
    "/admin/reviews",
    withParams(params)
  );
  return response.data.data;
}

export async function deleteAdminReviewApi(id: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(`/admin/reviews/${id}`);
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

export async function getAdminNotificationsApi(params?: AdminListParams) {
  const response = await axiosInstance.get<ApiResponse<AdminNotificationsResponse>>(
    "/admin/notifications",
    withParams(params)
  );
  return response.data.data;
}

export async function createAdminNotificationApi(
  data: CreateAdminNotificationRequest
) {
  const response = await axiosInstance.post<ApiResponse<{ count: number }>>(
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
