import type {
  AdminBooking,
  AdminCar,
  AdminCategoryItem,
  AdminChartPoint,
  AdminDashboardStats,
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
} from "../types";

export const adminStats: AdminDashboardStats = {
  totalUsers: 12480,
  totalTraders: 386,
  activeRentalCars: 1840,
  carsForSale: 724,
  totalBookings: 9230,
  totalOrders: 1140,
  monthlyRevenue: 2865000,
  platformCommission: 214800,
  pendingVerifications: 18,
  openReports: 27,
};

export const adminChartData: AdminChartPoint[] = [
  { labelKey: "jan", revenue: 1820000, bookings: 680, orders: 82 },
  { labelKey: "feb", revenue: 1960000, bookings: 720, orders: 91 },
  { labelKey: "mar", revenue: 2130000, bookings: 790, orders: 104 },
  { labelKey: "apr", revenue: 2410000, bookings: 860, orders: 118 },
  { labelKey: "may", revenue: 2650000, bookings: 910, orders: 126 },
  { labelKey: "jun", revenue: 2865000, bookings: 980, orders: 139 },
];

export const adminUsers: AdminUser[] = [
  { id: "u-1001", name: "Omar Hassan", email: "omar@example.com", phone: "+20 100 111 2233", status: "active", createdAt: "2026-06-20", totalBookings: 8, totalOrders: 2 },
  { id: "u-1002", name: "Mariam Adel", email: "mariam@example.com", phone: "+20 111 222 3344", status: "active", createdAt: "2026-06-18", totalBookings: 4, totalOrders: 0 },
  { id: "u-1003", name: "Karim Fouad", email: "karim@example.com", phone: "+20 122 333 4455", status: "suspended", createdAt: "2026-06-11", totalBookings: 1, totalOrders: 1 },
  { id: "u-1004", name: "Salma Tarek", email: "salma@example.com", phone: "+20 101 444 5566", status: "inactive", createdAt: "2026-05-30", totalBookings: 0, totalOrders: 2 },
];

export const adminTraders: AdminTrader[] = [
  { id: "t-2001", businessName: "Cairo Premium Cars", ownerName: "Ahmed Nabil", email: "owner@cpcars.com", phone: "+20 100 500 6000", verificationStatus: "approved", carsCount: 42, earnings: 428000, joinedAt: "2026-03-12" },
  { id: "t-2002", businessName: "Alex Auto Hub", ownerName: "Nour Samir", email: "nour@alexauto.com", phone: "+20 111 700 8000", verificationStatus: "pending", carsCount: 18, earnings: 162000, joinedAt: "2026-05-02" },
  { id: "t-2003", businessName: "Delta Motors", ownerName: "Youssef Ali", email: "sales@delta.com", phone: "+20 122 900 1000", verificationStatus: "rejected", carsCount: 9, earnings: 68000, joinedAt: "2026-04-22" },
];

export const adminCars: AdminCar[] = [
  { id: "r-3001", title: "Toyota Corolla 2024", image: "/assets/images/landing/car1.png", traderName: "Cairo Premium Cars", category: "Sedan", status: "active", type: "rent", price: 1800, location: "Cairo" },
  { id: "r-3002", title: "Kia Sportage 2024", image: "/assets/images/landing/car2.png", traderName: "Alex Auto Hub", category: "SUV", status: "pending", type: "rent", price: 2600, location: "Alexandria" },
  { id: "s-3003", title: "BMW 320i 2022", image: "/assets/images/landing/car3.png", traderName: "Delta Motors", category: "Sedan", status: "active", type: "sale", price: 1850000, location: "Giza" },
  { id: "s-3004", title: "Nissan Qashqai 2023", image: "/assets/images/landing/car1.png", traderName: "Cairo Premium Cars", category: "SUV", status: "sold", type: "sale", price: 1450000, location: "Cairo" },
];

export const adminBookings: AdminBooking[] = [
  { id: "BKG-9011", customerName: "Omar Hassan", traderName: "Cairo Premium Cars", carTitle: "Toyota Corolla 2024", pickupDate: "2026-07-02", returnDate: "2026-07-06", price: 7200, status: "confirmed" },
  { id: "BKG-9012", customerName: "Mariam Adel", traderName: "Alex Auto Hub", carTitle: "Kia Sportage 2024", pickupDate: "2026-07-10", returnDate: "2026-07-12", price: 5200, status: "pending" },
  { id: "BKG-9013", customerName: "Karim Fouad", traderName: "Delta Motors", carTitle: "Hyundai Elantra 2023", pickupDate: "2026-06-18", returnDate: "2026-06-20", price: 3300, status: "completed" },
];

export const adminOrders: AdminOrder[] = [
  { id: "ORD-7011", customerName: "Salma Tarek", traderName: "Delta Motors", carTitle: "BMW 320i 2022", price: 1850000, paymentStatus: "paid", orderStatus: "processing" },
  { id: "ORD-7012", customerName: "Omar Hassan", traderName: "Cairo Premium Cars", carTitle: "Nissan Qashqai 2023", price: 1450000, paymentStatus: "pending", orderStatus: "pending" },
];

export const adminReviews: AdminReview[] = [
  { id: "rev-1", customerName: "Omar Hassan", carTitle: "Toyota Corolla 2024", rating: 5, review: "Clean car and smooth pickup.", date: "2026-06-22", status: "active" },
  { id: "rev-2", customerName: "Mariam Adel", carTitle: "Kia Sportage 2024", rating: 4, review: "Good experience, delivery was slightly late.", date: "2026-06-19", status: "active" },
];

export const adminReports: AdminReport[] = [
  { id: "rep-1", reporterName: "Salma Tarek", targetType: "car", targetName: "BMW 320i 2022", reason: "Incorrect mileage", date: "2026-06-24", status: "open" },
  { id: "rep-2", reporterName: "Omar Hassan", targetType: "review", targetName: "Review #rev-2", reason: "Inappropriate language", date: "2026-06-21", status: "resolved" },
  { id: "rep-3", reporterName: "Mariam Adel", targetType: "trader", targetName: "Delta Motors", reason: "Delayed response", date: "2026-06-17", status: "open" },
];

export const adminPayments: AdminPaymentSummary = {
  totalRevenue: adminStats.monthlyRevenue,
  platformCommission: adminStats.platformCommission,
  pendingWithdrawals: 126000,
  completedWithdrawals: 820000,
  transactions: [
    { id: "txn-1", traderName: "Cairo Premium Cars", type: "commission", amount: 18400, status: "completed", date: "2026-06-25" },
    { id: "txn-2", traderName: "Alex Auto Hub", type: "withdrawal", amount: 52000, status: "pending", date: "2026-06-24" },
    { id: "txn-3", traderName: "Delta Motors", type: "order", amount: 1850000, status: "completed", date: "2026-06-22" },
  ],
};

export const adminVerificationRequests: AdminVerificationRequest[] = [
  {
    id: "ver-1",
    traderName: "Nour Samir",
    businessName: "Alex Auto Hub",
    submittedAt: "2026-06-20",
    status: "pending",
    documents: {
      nationalId: "National ID",
      commercialRegister: "Commercial Register",
      taxCard: "Tax Card",
      vehicleLicense: "Vehicle License",
    },
  },
  {
    id: "ver-2",
    traderName: "Ahmed Nabil",
    businessName: "Cairo Premium Cars",
    submittedAt: "2026-06-10",
    status: "approved",
    documents: {
      nationalId: "National ID",
      commercialRegister: "Commercial Register",
      taxCard: "Tax Card",
      vehicleLicense: "Vehicle License",
    },
  },
];

export const adminNotifications: AdminNotification[] = [
  { id: "not-1", title: "Holiday demand update", message: "Bookings are trending up this week.", audience: "traders", createdAt: "2026-06-26", status: "sent" },
  { id: "not-2", title: "New safety policy", message: "Please review updated rental safety guidance.", audience: "all", createdAt: "2026-06-22", status: "draft" },
];

export const adminCategories: AdminCategoryItem[] = [
  { id: "cat-1", name: "Sedan", type: "category", status: "active" },
  { id: "cat-2", name: "SUV", type: "category", status: "active" },
  { id: "brand-1", name: "Toyota", type: "brand", status: "active" },
  { id: "model-1", name: "Corolla", type: "model", status: "active" },
];

export const adminLocations: AdminCategoryItem[] = [
  { id: "country-1", name: "Egypt", type: "country", status: "active" },
  { id: "city-1", name: "Cairo", type: "city", status: "active" },
  { id: "city-2", name: "Alexandria", type: "city", status: "active" },
  { id: "city-3", name: "Giza", type: "city", status: "active" },
];

export const adminPromotions: AdminPromotion[] = [
  { id: "promo-1", name: "SUMMER10", type: "coupon", value: "10%", status: "active", endsAt: "2026-08-01" },
  { id: "promo-2", name: "Featured BMW 320i", type: "featuredCar", value: "7 days", status: "active", endsAt: "2026-07-05" },
  { id: "promo-3", name: "Cairo Premium Spotlight", type: "featuredTrader", value: "Homepage", status: "inactive", endsAt: "2026-07-18" },
];

export const adminSettings: AdminSettings = {
  general: "Rento",
  platform: "Marketplace",
  security: "Two-factor admin review",
  email: "support@rento.com",
  notifications: "Enabled",
  payments: "Manual withdrawals",
  commission: "8%",
  localization: "Arabic and English",
};
