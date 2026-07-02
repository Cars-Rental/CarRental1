import type { BodyType, FuelType, Transmission } from "@/features/cars/types/cars-api.types";

export type TraderCarType = "rent" | "sale";
export type TraderCarStatus = "active" | "maintenance" | "sold" | "inactive";
export type TraderBookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled" | "rejected" | "accepted";
export type TraderOrderStatus = "pending" | "negotiating" | "accepted" | "rejected" | "completed" | "cancelled";

export interface TraderDashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeRentalCars: number;
  carsForSale: number;
  pendingBookings: number;
  completedOrders: number;
  totalCustomers: number;
  averageRating: number;
}

export interface TraderOverviewOrder {
  id: string;
  customerName: string;
  carTitle: string;
  totalPrice: number;
  status: string;
}

export interface TraderOverviewResponse {
  revenue: {
    rent: number;
    buy: number;
    total: number;
  };
  activeRentals: number;
  pendingOrders: {
    rent: number;
    buy: number;
    total: number;
  };
  completedOrders: {
    rent: number;
    buy: number;
    total: number;
  };
  totalCustomers: number;
  reviews: {
    average: number;
    total: number;
  };
  recentRentOrders: TraderOverviewOrder[];
  recentBuyOrders: TraderOverviewOrder[];
}

export interface TraderDashboardCarResponseItem {
  id: string;
  name: string;
  model: string;
  year: number;
  image?: {
    secure_url: string;
    public_id: string;
    _id: string;
  };
  location: string;
  price: number;
  specs: {
    transmission: string;
    seats: number;
  };
  status?: string;
}

export interface TraderDashboardCarsResponse {
  total: number;
  page: number;
  limit: number;
  cars: TraderDashboardCarResponseItem[];
}

export interface TraderDashboardRentOrderItem {
  id: string;
  customer: string;
  car: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export interface TraderDashboardBuyOrderItem {
  id: string;
  customer: string;
  car: string;
  carprice: number;
  createdAt: string;
  status: string;
}

export interface TraderDashboardRentOrdersResponse {
  total: number;
  page: number;
  limit: number;
  orders: TraderDashboardRentOrderItem[];
}

export interface TraderDashboardBuyOrdersResponse {
  total: number;
  page: number;
  limit: number;
  orders: TraderDashboardBuyOrderItem[];
}

export interface TraderDashboardCustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

export interface TraderDashboardCustomersResponse {
  total: number;
  page: number;
  limit: number;
  customers: TraderDashboardCustomerItem[];
}

export interface TraderDashboardEarningsResponse {
  available: number;
  pending: number;
  total: number;
  breakdown: {
    rent: {
      earned: number;
      pending: number;
    };
    buy: {
      earned: number;
      pending: number;
    };
  };
  monthlyBreakdown: Array<{
    month?: string;
    earned?: number;
    pending?: number;
    total?: number;
  }>;
}

export interface TraderDashboardAnalyticsCarDetails {
  carbrand: string;
  carname: string;
  carmodel: string;
  carprice: number;
}

export interface TraderDashboardTopRentCar {
  _id: string;
  revenue: number;
  bookings: number;
  car: TraderDashboardAnalyticsCarDetails;
}

export interface TraderDashboardTopBuyCar {
  _id: string;
  revenue: number;
  sales: number;
  car: TraderDashboardAnalyticsCarDetails;
}

export interface TraderDashboardOrderVolumeItem {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface TraderDashboardAnalyticsResponse {
  summary: {
    monthlyRevenue: number;
    openDemand: number;
    conversionRate: number;
    totalRentRevenue: number;
    totalBuyRevenue: number;
  };
  revenueMix: {
    rentPercent: number;
    buyPercent: number;
  };
  revenueTimeline: Array<{
    month: string;
    rentRevenue: number;
    buyRevenue: number;
    rentOrders: number;
    buyOrders: number;
    totalRevenue: number;
  }>;
  orderVolume: {
    rent: TraderDashboardOrderVolumeItem[];
    buy: TraderDashboardOrderVolumeItem[];
  };
  statusDistribution: {
    rent: Record<string, number>;
    buy: Record<string, number>;
  };
  topPerformingCars: {
    rent: TraderDashboardTopRentCar[];
    buy: TraderDashboardTopBuyCar[];
  };
  conversionRate: {
    rent: number;
    buy: number;
    overall: number;
  };
}

export interface TraderDashboardActivityItem {
  type: "buy_order" | "rent_order";
  _id: string;
  car: {
    _id: string;
    carbrand: string;
    carname: string;
    carimage: Array<{
      secure_url: string;
      public_id: string;
      _id: string;
    }>;
  };
  user: {
    _id: string;
    userName: string;
  } | null;
  carprice?: number;
  totalPrice?: number;
  status: string;
  createdAt: string;
}

export interface TraderRecentActivity {
  id: string;
  type: "buy_order" | "rent_order";
  customerName: string;
  carTitle: string;
  image: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface TraderDashboardRecentActivityResponse {
  activities: TraderDashboardActivityItem[];
}

export interface TraderDashboardReviewItem {
  id: string;
  customerId: string;
  customerName: string;
  carId: string;
  carTitle: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface TraderDashboardReviewsResponse {
  total: number;
  page: number;
  limit: number;
  stats: {
    average: number;
    distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  };
  reviews: TraderDashboardReviewItem[];
}

export interface TraderNotificationSender {
  _id: string;
  userName?: string;
  avatar?: string;
}

export interface TraderNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  sender?: TraderNotificationSender | null;
  createdAt: string;
  updatedAt?: string;
}

export interface TraderNotificationsResponse {
  notifications: TraderNotification[];
  total: number;
  page: number;
  limit: number;
}

export interface TraderCar {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  images?: string[];
  location: string;
  type: TraderCarType;
  price: number;
  transmission: Transmission | string;
  fuelType: FuelType | string;
  bodyType?: BodyType | string;
  seats: number;
  status: TraderCarStatus;
  rating?: number;
  bookingsCount?: number;
  
  // Sale specific
  salePrice?: number;
  mileage?: number;
  condition?: string;
  isNegotiable?: boolean;
}

export interface TraderBooking {
  id: string;
  carId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: TraderBookingStatus;
  customerName: string;
  carTitle: string;
}

export interface TraderOrder {
  id: string;
  carId: string;
  customerId: string;
  offerPrice: number;
  status: TraderOrderStatus;
  createdAt: string;
  customerName: string;
  carTitle: string;
}

export interface TraderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "inactive";
}

export interface TraderReview {
  id: string;
  customerId: string;
  carId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  customerName: string;
  carTitle: string;
}

export interface TraderEarnings {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  breakdown?: TraderDashboardEarningsResponse["breakdown"];
  monthlyBreakdown?: TraderDashboardEarningsResponse["monthlyBreakdown"];
}

export interface TraderTransaction {
  id: string;
  type: "earning" | "withdrawal";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTraderCarRequest {
  title: string;
  brand: string;
  model: string;
  year: number;
  type: TraderCarType;
  price: number;
  location: string;
  transmission: string;
  fuelType: string;
  seats: number;
  description: string;
  status: TraderCarStatus;
  images: string[];
}

export type UpdateTraderCarRequest = Partial<CreateTraderCarRequest>;

export interface UpdateBookingStatusRequest {
  status: TraderBookingStatus;
}

export interface UpdateOrderStatusRequest {
  status: TraderOrderStatus;
}
