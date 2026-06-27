import type { BodyType, FuelType, Transmission } from "@/features/cars/types/cars-api.types";

export type TraderCarType = "rent" | "sale";
export type TraderCarStatus = "active" | "maintenance" | "sold" | "inactive";
export type TraderBookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled" | "rejected";
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
  createdAt: string;
  customerName: string;
  carTitle: string;
}

export interface TraderEarnings {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
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
