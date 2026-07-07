import type {
  UserBooking,
  UserFavoriteCar,
  UserOrder,
  UserProfile,
  UserSettings,
} from "../types";

export const mockUserProfile: UserProfile = {
  id: "user-001",
  userName: "Omar Hassan",
  email: "omar.hassan@example.com",
  phone: "+20 100 111 2233",
  gender: "Male",
  role: "User",
  status: "active",
  joinedAt: "2025-09-18",
  bookingsCount: 8,
  ordersCount: 2,
  favoritesCount: 4,
};

export const mockUserBookings: UserBooking[] = [
  {
    id: "booking-001",
    carId: "rent-001",
    carTitle: "Toyota Corolla 2024",
    carImage: "/assets/images/landing/car1.png",
    pickupDate: "2026-07-04",
    returnDate: "2026-07-08",
    totalDays: 4,
    totalPrice: 7200,
    status: "confirmed",
  },
  {
    id: "booking-002",
    carId: "rent-002",
    carTitle: "Kia Sportage 2024",
    carImage: "/assets/images/landing/car2.png",
    pickupDate: "2026-06-12",
    returnDate: "2026-06-15",
    totalDays: 3,
    totalPrice: 7800,
    status: "completed",
  },
  {
    id: "booking-003",
    carId: "rent-003",
    carTitle: "Hyundai Elantra 2023",
    carImage: "/assets/images/landing/car3.png",
    pickupDate: "2026-07-20",
    returnDate: "2026-07-22",
    totalDays: 2,
    totalPrice: 3300,
    status: "pending",
  },
];

export const mockUserOrders: UserOrder[] = [
  {
    id: "order-001",
    carId: "sale-001",
    carTitle: "BMW 320i 2022",
    carImage: "/assets/images/landing/car2.png",
    salePrice: 1850000,
    orderDate: "2026-06-22",
    paymentStatus: "paid",
    status: "processing",
  },
  {
    id: "order-002",
    carId: "sale-002",
    carTitle: "Nissan Qashqai 2023",
    carImage: "/assets/images/landing/car3.png",
    salePrice: 1450000,
    orderDate: "2026-05-14",
    paymentStatus: "pending",
    status: "pending",
  },
];

export const mockUserFavorites: UserFavoriteCar[] = [
  {
    id: "rent-001",
    title: "Toyota Corolla 2024",
    brand: "Toyota",
    model: "Corolla",
    year: 2024,
    image: "/assets/images/landing/car1.png",
    location: "Cairo",
    price: 1800,
    type: "rent",
  },
  {
    id: "sale-001",
    title: "BMW 320i 2022",
    brand: "BMW",
    model: "320i",
    year: 2022,
    image: "/assets/images/landing/car2.png",
    location: "Giza",
    price: 1850000,
    type: "sale",
  },
  {
    id: "rent-003",
    title: "Kia Sportage 2024",
    brand: "Kia",
    model: "Sportage",
    year: 2024,
    image: "/assets/images/landing/car3.png",
    location: "Alexandria",
    price: 2600,
    type: "rent",
  },
];

export const mockUserSettings: UserSettings = {
  emailNotifications: true,
  smsNotifications: false,
  marketingNotifications: true,
  language: "en",
  theme: "system",
};
