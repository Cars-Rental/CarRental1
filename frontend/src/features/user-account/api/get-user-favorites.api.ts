import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import type { UserFavoriteCar, WishlistApiResponse } from "../types";

function mapWishlistType(type: WishlistApiResponse["wishlist"][number]["type"]) {
  return type === "buy" ? "sale" : type;
}

export async function getUserFavoritesApi(): Promise<UserFavoriteCar[]> {
  const response =
    await axiosInstance.get<WishlistApiResponse>(
      API_ENDPOINTS.FAVORITES
    );
  return response.data.wishlist.map((car) => ({
    id: car.id,
    title: car.title,
    brand: car.brand,
    name: car.name,
    model: car.model,
    year: car.year,
    image: car.image,
    location: car.location,
    price: car.price,
    type: mapWishlistType(car.type),
  }));
}
