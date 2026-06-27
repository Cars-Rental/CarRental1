import type {
  PaginatedResponse,
  TraderBooking,
  TraderCar,
  TraderCustomer,
  TraderDashboardStats,
  TraderEarnings,
  TraderOrder,
  TraderReview,
} from "../types";

export interface TraderAnalyticsPoint {
  labelKey: string;
  revenue: number;
  bookings: number;
  orders: number;
}

export interface TraderAnalyticsSegment {
  labelKey: string;
  value: number;
  colorClass: string;
}

export interface TraderAnalyticsCarPerformance {
  carTitle: string;
  views: number;
  conversionRate: number;
  revenue: number;
}

export const mockTraderCars: TraderCar[] = [
  {
    id: "rent-001",
    title: "Toyota Corolla 2024",
    brand: "Toyota",
    model: "Corolla",
    year: 2024,
    image: "/images/cars/toyota-corolla.jpg",
    location: "New Cairo",
    type: "rent",
    price: 1800,
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "sedan",
    seats: 5,
    status: "active",
    rating: 4.8,
    bookingsCount: 18,
  },
  {
    id: "rent-002",
    title: "Hyundai Elantra 2023",
    brand: "Hyundai",
    model: "Elantra",
    year: 2023,
    image: "/images/cars/hyundai-elantra.jpg",
    location: "Nasr City",
    type: "rent",
    price: 1650,
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "sedan",
    seats: 5,
    status: "maintenance",
    rating: 4.6,
    bookingsCount: 12,
  },
  {
    id: "rent-003",
    title: "Kia Sportage 2024",
    brand: "Kia",
    model: "Sportage",
    year: 2024,
    image: "/images/cars/kia-sportage.jpg",
    location: "Sheikh Zayed",
    type: "rent",
    price: 2600,
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "suv",
    seats: 5,
    status: "active",
    rating: 4.9,
    bookingsCount: 9,
  },
  {
    id: "sale-001",
    title: "BMW 320i 2022",
    brand: "BMW",
    model: "320i",
    year: 2022,
    image: "/images/cars/bmw-320i.jpg",
    location: "Heliopolis",
    type: "sale",
    price: 1850000,
    salePrice: 1850000,
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "sedan",
    seats: 5,
    status: "active",
    mileage: 42000,
    condition: "Excellent",
    isNegotiable: true,
  },
  {
    id: "sale-002",
    title: "Mercedes C180 2021",
    brand: "Mercedes-Benz",
    model: "C180",
    year: 2021,
    image: "/images/cars/mercedes-c180.jpg",
    location: "Maadi",
    type: "sale",
    price: 2100000,
    salePrice: 2100000,
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "sedan",
    seats: 5,
    status: "sold",
    mileage: 56000,
    condition: "Very Good",
    isNegotiable: false,
  },
  {
    id: "sale-003",
    title: "Nissan Qashqai 2023",
    brand: "Nissan",
    model: "Qashqai",
    year: 2023,
    image: "/images/cars/nissan-qashqai.jpg",
    location: "6th of October",
    type: "sale",
    price: 1450000,
    salePrice: 1450000,
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "suv",
    seats: 5,
    status: "active",
    mileage: 25000,
    condition: "Excellent",
    isNegotiable: true,
  },
];

export const mockTraderBookings: TraderBooking[] = [
  {
    id: "booking-001",
    carId: "rent-001",
    customerId: "customer-001",
    startDate: "2026-06-28",
    endDate: "2026-07-02",
    totalPrice: 7200,
    status: "confirmed",
    customerName: "Omar Hassan",
    carTitle: "Toyota Corolla 2024",
  },
  {
    id: "booking-002",
    carId: "rent-003",
    customerId: "customer-002",
    startDate: "2026-07-04",
    endDate: "2026-07-08",
    totalPrice: 10400,
    status: "pending",
    customerName: "Mariam Adel",
    carTitle: "Kia Sportage 2024",
  },
  {
    id: "booking-003",
    carId: "rent-001",
    customerId: "customer-003",
    startDate: "2026-06-18",
    endDate: "2026-06-22",
    totalPrice: 7200,
    status: "completed",
    customerName: "Youssef Nabil",
    carTitle: "Toyota Corolla 2024",
  },
];

export const mockTraderOrders: TraderOrder[] = [
  {
    id: "order-001",
    carId: "sale-001",
    customerId: "customer-004",
    offerPrice: 1780000,
    status: "negotiating",
    createdAt: "2026-06-24",
    customerName: "Salma Tarek",
    carTitle: "BMW 320i 2022",
  },
  {
    id: "order-002",
    carId: "sale-003",
    customerId: "customer-001",
    offerPrice: 1420000,
    status: "accepted",
    createdAt: "2026-06-22",
    customerName: "Omar Hassan",
    carTitle: "Nissan Qashqai 2023",
  },
  {
    id: "order-003",
    carId: "sale-002",
    customerId: "customer-005",
    offerPrice: 2050000,
    status: "completed",
    createdAt: "2026-06-15",
    customerName: "Karim Fouad",
    carTitle: "Mercedes C180 2021",
  },
];

export const mockTraderCustomers: TraderCustomer[] = [
  {
    id: "customer-001",
    name: "Omar Hassan",
    email: "omar.hassan@example.com",
    phone: "+20 100 111 2233",
    bookingsCount: 3,
    ordersCount: 1,
    totalSpent: 28600,
    status: "active",
  },
  {
    id: "customer-002",
    name: "Mariam Adel",
    email: "mariam.adel@example.com",
    phone: "+20 111 222 3344",
    bookingsCount: 1,
    ordersCount: 0,
    totalSpent: 10400,
    status: "active",
  },
  {
    id: "customer-003",
    name: "Youssef Nabil",
    email: "youssef.nabil@example.com",
    phone: "+20 122 333 4455",
    bookingsCount: 2,
    ordersCount: 0,
    totalSpent: 14400,
    status: "inactive",
  },
  {
    id: "customer-004",
    name: "Salma Tarek",
    email: "salma.tarek@example.com",
    phone: "+20 101 444 5566",
    bookingsCount: 0,
    ordersCount: 2,
    totalSpent: 0,
    status: "active",
  },
];

export const mockTraderReviews: TraderReview[] = [
  {
    id: "review-001",
    customerId: "customer-001",
    carId: "rent-001",
    rating: 5,
    comment: "Clean car, smooth pickup, and very professional service.",
    createdAt: "2026-06-20",
    customerName: "Omar Hassan",
    carTitle: "Toyota Corolla 2024",
  },
  {
    id: "review-002",
    customerId: "customer-003",
    carId: "rent-003",
    rating: 4.5,
    comment: "Great SUV for a family trip. Delivery was on time.",
    createdAt: "2026-06-18",
    customerName: "Youssef Nabil",
    carTitle: "Kia Sportage 2024",
  },
];

export const mockTraderEarnings: TraderEarnings = {
  availableBalance: 84200,
  pendingBalance: 17800,
  totalEarnings: 286500,
};

export const mockTraderDashboardStats: TraderDashboardStats = {
  totalRevenue: mockTraderEarnings.totalEarnings,
  monthlyRevenue: 64200,
  activeRentalCars: mockTraderCars.filter(
    (car) => car.type === "rent" && car.status === "active"
  ).length,
  carsForSale: mockTraderCars.filter(
    (car) => car.type === "sale" && car.status === "active"
  ).length,
  pendingBookings: mockTraderBookings.filter(
    (booking) => booking.status === "pending"
  ).length,
  completedOrders: mockTraderOrders.filter(
    (order) => order.status === "completed"
  ).length,
  totalCustomers: mockTraderCustomers.length,
  averageRating: 4.7,
};

export const mockTraderAnalyticsTrend: TraderAnalyticsPoint[] = [
  { labelKey: "jan", revenue: 38000, bookings: 12, orders: 3 },
  { labelKey: "feb", revenue: 42500, bookings: 15, orders: 4 },
  { labelKey: "mar", revenue: 49200, bookings: 17, orders: 5 },
  { labelKey: "apr", revenue: 55800, bookings: 21, orders: 6 },
  { labelKey: "may", revenue: 61300, bookings: 23, orders: 7 },
  { labelKey: "jun", revenue: 64200, bookings: 26, orders: 8 },
];

export const mockTraderAnalyticsSources: TraderAnalyticsSegment[] = [
  { labelKey: "rentals", value: 58, colorClass: "bg-emerald-500" },
  { labelKey: "sales", value: 32, colorClass: "bg-sky-500" },
  { labelKey: "returningCustomers", value: 10, colorClass: "bg-amber-500" },
];

export const mockTraderAnalyticsCarPerformance: TraderAnalyticsCarPerformance[] =
  [
    {
      carTitle: "Toyota Corolla 2024",
      views: 1260,
      conversionRate: 18,
      revenue: 68400,
    },
    {
      carTitle: "Kia Sportage 2024",
      views: 980,
      conversionRate: 15,
      revenue: 62400,
    },
    {
      carTitle: "BMW 320i 2022",
      views: 740,
      conversionRate: 9,
      revenue: 44500,
    },
    {
      carTitle: "Nissan Qashqai 2023",
      views: 690,
      conversionRate: 11,
      revenue: 39200,
    },
  ];

export const toMockPaginatedResponse = <T>(
  data: T[],
  page = 1,
  limit = data.length
): PaginatedResponse<T> => ({
  data,
  total: data.length,
  page,
  limit,
  totalPages: data.length === 0 ? 0 : Math.ceil(data.length / limit),
});
