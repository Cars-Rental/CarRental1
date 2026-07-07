export type AdminEntityStatus =
  | "active"
  | "inactive"
  | "banned"
  | "pending"
  | "suspended"
  | "approved"
  | "rejected"
  | "resolved"
  | "open"
  | "hidden"
  | "cancelled"
  | "completed"
  | "paid"
  | "failed";

export interface AdminDashboardStats {
  totalUsers: number;
  totalTraders: number;
  activeRentalCars: number;
  carsForSale: number;
  totalBookings: number;
  totalOrders: number;
  monthlyRevenue: number;
  platformCommission: number;
  pendingVerifications?: number;
  openReports?: number;
}

export interface AdminOverviewPerson {
  id: string;
  name: string;
  status: string;
}

export interface AdminOverviewActivity {
  id: string;
  customerName: string;
  status: string;
}

export interface AdminOverviewResponse {
  stats: AdminDashboardStats;
  recentUsers: AdminOverviewPerson[];
  recentTraders: AdminOverviewPerson[];
  recentBookings: AdminOverviewActivity[];
  recentOrders: AdminOverviewActivity[];
}

export interface AdminChartPoint {
  labelKey: string;
  revenue: number;
  bookings: number;
  orders: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "banned" | "suspended" | "inactive";
  createdAt: string;
  totalBookings?: number;
  totalOrders?: number;
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: AdminPagination;
}

export interface AdminTrader {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  status?: "active" | "banned" | "pending" | "approved" | "rejected";
  verificationStatus?: "pending" | "approved" | "rejected";
  carsCount: number;
  earnings: number;
  joinedAt: string;
  rentCarsCount?: number;
  saleCarsCount?: number;
}

export interface AdminTradersResponse {
  traders: AdminTrader[];
  pagination: AdminPagination;
}

export interface AdminCar {
  id: string;
  title: string;
  image: string | null;
  traderName: string;
  category: string;
  status: string;
  type?: "rent" | "sale";
  price: number;
  location: string;
  fuel?: string;
  transmission?: string;
  seatCount?: number;
}

export interface AdminCarsResponse {
  cars: AdminCar[];
  pagination: AdminPagination;
}

export interface AdminCarDetail {
  _id: string;
  carbrand: string;
  carname: string;
  carmodel: string;
  year: number;
  location: string;
  distance?: string;
  carprice: number;
  fuel: string;
  seatCount: number;
  Body_Type: string;
  Transmission: string;
  owner:
    | string
    | {
        _id: string;
        userName: string;
        email: string;
        phone: string;
      };
  carimage: Array<{
    secure_url: string;
    public_id: string;
    _id: string;
  }>;
  isavailable: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBooking {
  id: string;
  idBk?: string;
  customerName: string;
  traderName: string;
  carTitle: string;
  carModel?: string;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  priceperDay?: number;
  totalPrice?: number;
  pickupDate?: string;
  returnDate?: string;
  price?: number;
  status: string;
}

export interface AdminBookingsResponse {
  bookings: AdminBooking[];
  pagination: AdminPagination;
}

export interface AdminOrder {
  id: string;
  id_ORD?: string;
  customerName: string;
  traderName: string;
  carTitle: string;
  carModel?: string;
  price: number;
  paymentStatus?: "pending" | "paid" | "failed";
  orderStatus?: "pending" | "processing" | "completed" | "cancelled";
  status?: string;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  pagination: AdminPagination;
}

export interface AdminPersonDetail {
  _id: string;
  userName: string;
  email: string;
  phone: string;
}

export interface AdminOrderCarDetail {
  _id: string;
  carbrand?: string;
  carname?: string;
  carmodel?: string;
  year?: number;
  location?: string;
  carprice?: number;
  distance?: string;
  fuel?: string;
  seatCount?: number;
  Body_Type?: string;
  Transmission?: string;
  carimage?: Array<{
    secure_url: string;
    public_id: string;
    _id: string;
  }>;
}

export interface AdminBookingDetail {
  _id: string;
  displayId: string;
  car: AdminOrderCarDetail | null;
  user: AdminPersonDetail | null;
  owner: AdminPersonDetail | null;
  startDate: string;
  endDate: string;
  totalDays: number;
  priceperDay: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderDetail {
  _id: string;
  displayId: string;
  car: AdminOrderCarDetail | null;
  user: AdminPersonDetail | null;
  owner: AdminPersonDetail | null;
  carprice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReview {
  id: string;
  customerName: string;
  carTitle: string;
  carModel?: string;
  rating: number;
  comment?: string;
  review?: string;
  date?: string;
  status?: "active" | "hidden";
}

export interface AdminReviewsResponse {
  reviews: AdminReview[];
  pagination: AdminPagination;
}

export interface AdminReport {
  id: string;
  reporterName: string;
  targetType: "car" | "review" | "trader" | "user";
  targetName: string;
  reason: string;
  date: string;
  status: "open" | "resolved" | "dismissed";
}

export interface AdminTransaction {
  id: string;
  traderName: string;
  type: "booking" | "order" | "withdrawal" | "commission";
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
}

export interface AdminPaymentSummary {
  totalRevenue: number;
  platformCommission: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  transactions: AdminTransaction[];
}

export interface AdminVerificationRequest {
  id: string;
  traderName: string;
  businessName: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  documents: {
    nationalId: string;
    commercialRegister: string;
    taxCard: string;
    vehicleLicense: string;
  };
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  audience: "all" | "users" | "traders" | "user" | "trader";
  recipientName?: string;
  createdAt: string;
  status: "sent" | "draft" | "read";
}

export interface AdminNotificationsResponse {
  notifications: AdminNotification[];
  pagination: AdminPagination;
}

export interface CreateAdminNotificationRequest {
  title: string;
  message: string;
  audience: "all" | "users" | "traders";
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  type: "category" | "brand" | "model" | "country" | "city";
  status: "active" | "inactive";
}

export interface AdminPromotion {
  id: string;
  name: string;
  type: "coupon" | "discount" | "featuredCar" | "featuredTrader";
  value: string;
  status: "active" | "inactive";
  endsAt: string;
}

export interface AdminSettings {
  general: string;
  platform: string;
  security: string;
  email: string;
  notifications: string;
  payments: string;
  commission: string;
  localization: string;
}

export interface AdminListParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export type UpdateAdminSettingsRequest = Partial<AdminSettings>;
