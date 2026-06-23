import type {
  Car,
  Stat,
  WhyUsFeature,
  HowItWorksStep,
  NavLink,
  FooterSection,
} from "../types/landing.types";

import { ROUTES } from "@/config/routes";
const { CARS, HOME, ABOUT, CONTACT } = ROUTES;
export const NAV_LINKS: NavLink[] = [
  { label: "Home", labelAr: "الرئيسية", href: HOME },
  { label: "Rent Cars", labelAr: "إيجار السيارات", href: CARS.RENT },
  { label: "Buy Cars", labelAr: "بيع السيارات", href: CARS.SALE },
  { label: "About Us", labelAr: "من نحن", href: ABOUT },
  { label: "Contact", labelAr: "تواصل معنا", href: CONTACT },
];

export const STATS: Stat[] = [
  { value: "5000+", label: "Active Users", labelAr: "مستخدم نشط" },
  { value: "1000+", label: "Cars Available", labelAr: "سيارة متاحة" },
  { value: "500+", label: "Certified Branches", labelAr: "فرع معتمد" },
];

export const WHY_US_FEATURES: WhyUsFeature[] = [
  {
    icon: "🛡️",
    title: "Full Safety",
    titleAr: "أمان كامل",
    description:
      "Comprehensive insurance coverage on all accidents and damages for all cars.",
    descriptionAr: "تأمين شامل على جميع الحوادث والأضرار لجميع السيارات.",
  },
  {
    icon: "⏱️",
    title: "Ease & Speed",
    titleAr: "سهولة وسرعة",
    description:
      "Book your perfect car in less than two minutes via app or website.",
    descriptionAr: "احجز سيارتك في أقل من دقيقتين عبر التطبيق أو الموقع.",
  },
  {
    icon: "💵",
    title: "Best Prices",
    titleAr: "أفضل الأسعار",
    description:
      "Complete transparency in pricing without any hidden fees or charges.",
    descriptionAr: "شفافية كاملة في الأسعار بدون أي رسوم خفية.",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    titleAr: "دعم 24/7",
    description:
      "Our customer service team is ready to assist you at any time.",
    descriptionAr: "فريق خدمة العملاء جاهز لمساعدتك في أي وقت.",
  },
];

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Search",
    titleAr: "ابحث",
    description:
      "Choose from categories of cars in your city easily with one click.",
    descriptionAr:
      "اختر من بين فئات السيارات في مدينتك بكل سهولة وبضغطة واحدة.",
    icon: "Search",
  },
  {
    step: 2,
    title: "Book",
    titleAr: "احجز",
    description:
      "Enter your details, choose the appropriate time, and secure your booking with full safety.",
    descriptionAr: "أدخل بياناتك، اختر الموعد المناسب، وأمن حجزك بأمان كامل.",
    icon: "Calendar",
  },
  {
    step: 3,
    title: "Drive",
    titleAr: "اقود",
    description:
      "Pick up keys from the dealer's location or request delivery to you and start your journey.",
    descriptionAr:
      "استلم مفاتيحك من موقع التاجر أو اطلب توصيلها إليك وابدأ رحلتك.",
    icon: "Key",
  },
];

export const FEATURED_RENTAL_CARS: Car[] = [
  {
    id: "r1",
    name: "Mercedes Benz E-Class",
    brand: "Mercedes",
    image: "/assets/images/landing/car2.png",
    pricePerDay: 2500,
    rating: 4.9,
    reviewCount: 94,
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    category: "luxury",
    available: true,
  },
  {
    id: "r2",
    name: "Kia Sportage 2024",
    brand: "Kia",
    image: "/assets/images/landing/car3.png",
    pricePerDay: 1800,
    rating: 4.7,
    reviewCount: 154,
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    category: "suv",
    available: true,
  },
  {
    id: "r3",
    name: "Toyota Corolla",
    brand: "Toyota",
    image: "/assets/images/landing/car1.png",
    pricePerDay: 1200,
    rating: 4.8,
    reviewCount: 210,
    seats: 5,
    transmission: "automatic",
    fuelType: "hybrid",
    category: "economy",
    available: true,
  },
];

export const FEATURED_BUY_CARS: Car[] = [
  {
    id: "b1",
    name: "Hyundai Elantra 2023",
    brand: "Hyundai",
    image: "/assets/images/landing/car1.png",
    pricePerDay: 0,
    priceTotal: 850000,
    rating: 4.6,
    reviewCount: 67,
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    category: "economy",
    available: true,
  },
  {
    id: "b2",
    name: "Toyota Land Cruiser 2024",
    brand: "Toyota",
    image: "/assets/images/landing/car2.png",
    pricePerDay: 0,
    priceTotal: 4800000,
    rating: 4.9,
    reviewCount: 45,
    seats: 7,
    transmission: "automatic",
    fuelType: "petrol",
    category: "suv",
    available: true,
  },
  {
    id: "b3",
    name: "Kia Sportage 2023",
    brand: "Kia",
    image: "/assets/images/landing/car3.png",
    pricePerDay: 0,
    priceTotal: 1550000,
    rating: 4.7,
    reviewCount: 112,
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    category: "suv",
    available: true,
  },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Quick Links",
    titleAr: "روابط سريعة",
    links: [
      { label: "Cars", labelAr: "السيارات", href: "/cars" },
      { label: "Special Offers", labelAr: "العروض الخاصة", href: "/offers" },
      { label: "Ad Gallery", labelAr: "معرض الإعلانات", href: "/gallery" },
      { label: "Contact Us", labelAr: "تواصل معنا", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    titleAr: "قانوني",
    links: [
      {
        label: "Terms & Conditions",
        labelAr: "الشروط والأحكام",
        href: "/terms",
      },
      { label: "Privacy Policy", labelAr: "سياسة الخصوصية", href: "/privacy" },
      { label: "FAQ", labelAr: "الأسئلة الشائعة", href: "/faq" },
    ],
  },
];
