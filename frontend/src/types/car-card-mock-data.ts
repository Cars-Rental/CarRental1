export type Transmission = "automatic" | "manual";
export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";
export type BodyType =
  | "sedan"
  | "suv"
  | "hatchback"
  | "coupe"
  | "pickup"
  | "van"
  | "convertible";

export interface MarketplaceCar {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  location: string;
  pricePerDay: number;
  priceTotal: number;
  transmission: Transmission;
  fuelType: FuelType;
  bodyType: BodyType;
  seats: number;
  mileage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  available: boolean;
  isNew: boolean;
  badge?: string;
}
