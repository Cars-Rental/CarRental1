export type AdminEntityStatus =
  | "active"
  | "inactive"
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
  pendingVerifications: number;
  openReports: number;
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
  status: "active" | "suspended" | "inactive";
  createdAt: string;
  totalBookings: number;
  totalOrders: number;
}

export interface AdminTrader {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  verificationStatus: "pending" | "approved" | "rejected";
  carsCount: number;
  earnings: number;
  joinedAt: string;
}

export interface AdminCar {
  id: string;
  title: string;
  image: string;
  traderName: string;
  category: string;
  status: "active" | "pending" | "suspended" | "sold";
  type: "rent" | "sale";
  price: number;
  location: string;
}

export interface AdminBooking {
  id: string;
  customerName: string;
  traderName: string;
  carTitle: string;
  pickupDate: string;
  returnDate: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface AdminOrder {
  id: string;
  customerName: string;
  traderName: string;
  carTitle: string;
  price: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "completed" | "cancelled";
}

export interface AdminReview {
  id: string;
  customerName: string;
  carTitle: string;
  rating: number;
  review: string;
  date: string;
  status: "active" | "hidden";
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
  audience: "all" | "users" | "traders";
  createdAt: string;
  status: "sent" | "draft";
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
}

export type UpdateAdminSettingsRequest = Partial<AdminSettings>;
