export interface Car {
  id: string;
  name: string;
  brand: string;
  image: string;
  pricePerDay: number;
  priceTotal?: number;
  rating: number;
  reviewCount: number;
  seats: number;
  transmission: "automatic" | "manual";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  category: "economy" | "luxury" | "suv" | "sports";
  available: boolean;
  badge?: string;
}

export interface Stat {
  value: string;
  label: string;
  labelAr: string;
}

export interface WhyUsFeature {
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
}

export interface SearchFormValues {
  location: string;
  pickupDate: string;
  returnDate: string;
  carType?: string;
}

export interface NavLink {
  key: string;
  href: string;
}

export interface FooterLink {
  label: string;
  labelAr: string;
  href: string;
}

export interface FooterSection {
  title: string;
  titleAr: string;
  links: FooterLink[];
}
