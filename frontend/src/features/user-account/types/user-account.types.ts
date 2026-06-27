import type { Gender, AuthUser } from "@/features/auth/types";

export type UserBookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export type UserOrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled";

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  phone: string;
  gender: Gender;
  role: AuthUser["role"];
  status: "active" | "inactive";
  joinedAt: string;
  bookingsCount: number;
  ordersCount: number;
  favoritesCount: number;
}

export interface UserBooking {
  id: string;
  carId: string;
  carTitle: string;
  carImage: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
  status: UserBookingStatus;
}

export interface UserOrder {
  id: string;
  carId: string;
  carTitle: string;
  carImage: string;
  salePrice: number;
  orderDate: string;
  paymentStatus: "pending" | "paid" | "refunded";
  status: UserOrderStatus;
}

export interface UserFavoriteCar {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  location: string;
  price: number;
  type: "rent" | "sale";
}

export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingNotifications: boolean;
  language: "en" | "ar";
  theme: "light" | "dark" | "system";
}

export interface UpdateProfileRequest {
  userName?: string;
  phone?: string;
  gender?: Gender;
}

export type UpdateUserSettingsRequest = Partial<UserSettings>;
