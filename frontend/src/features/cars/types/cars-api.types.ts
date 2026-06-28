export interface CarImage {
  secure_url: string;
  public_id: string;
  _id: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface YearRange {
  min: number;
  max: number;
}

export interface CarsFilterState {
  brands: string[];
  priceRange: PriceRange;
  yearRange: YearRange;
  transmission: Transmission | "";
  fuelType: FuelType | "";
  bodyType: BodyType | "";
  seats: number;
  location: string;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popular";
export interface CarOwner {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  role: string;
}

export interface RawCar {
  _id: string;
  carbrand: string;
  carname: string;
  carmodel: string;
  year: number;
  location: string;
  distance: string;
  carprice: number;
  fuel: string;
  seatCount: number;
  Body_Type: string;
  Transmission: string;
  owner: CarOwner | null;
  carimage: CarImage[];
  isavailable: string;
  createdAt: string;
  updatedAt: string;
}

export const EGYPT_LOCATIONS = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Menoufia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
] as const;

export type EgyptLocation = (typeof EGYPT_LOCATIONS)[number];
export const TRANSMISSIONS = ["automatic", "manual"] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const BODY_TYPES = [
  "sedan",
  "suv",
  "hatchback",
  "coupe",
  "pickup",
  "van",
  "convertible",
] as const;
export type BodyType = (typeof BODY_TYPES)[number];

export interface GetAllCarsRawResponse {
  success: boolean;
  message: string;
  totalCars: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: RawCar[];
}

export interface AddCarRequest {
  carbrand: string;
  carname: string;
  carmodel: string;
  year: number;
  location: EgyptLocation;
  distance: string;
  carprice: number;
  fuel: FuelType;
  seatCount: number;
  Body_Type: BodyType;
  Transmission: Transmission;
  images: string[];
}

export type UpdateCarRequest = Partial<AddCarRequest>;
