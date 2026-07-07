import type { RawCar } from "../types/cars-api.types";
import type { CarsFeatureState } from "../store/cars.slice";

type ModeState = CarsFeatureState["rent"] | CarsFeatureState["sale"];

export function filterAndSort(cars: RawCar[], state: ModeState): RawCar[] {
  let result = [...cars];

  if (state.search) {
    const q = state.search.toLowerCase();
    result = result.filter(
      (car) =>
        car.carname.toLowerCase().includes(q) ||
        car.carbrand.toLowerCase().includes(q) ||
        car.location.toLowerCase().includes(q),
    );
  }

  if (state.filters.brands.length > 0) {
    result = result.filter((car) =>
      state.filters.brands
        .map((b) => b.toLowerCase())
        .includes(car.carbrand.toLowerCase()),
    );
  }

  if (state.filters.priceRange.min > 0) {
    result = result.filter(
      (car) => car.carprice >= state.filters.priceRange.min,
    );
  }
  if (state.filters.priceRange.max > 0) {
    result = result.filter(
      (car) => car.carprice <= state.filters.priceRange.max,
    );
  }

  if (state.filters.yearRange.min > 0) {
    result = result.filter((car) => car.year >= state.filters.yearRange.min);
  }
  if (state.filters.yearRange.max > 0) {
    result = result.filter((car) => car.year <= state.filters.yearRange.max);
  }

  if (state.filters.transmission) {
    result = result.filter(
      (car) =>
        car.Transmission.toLowerCase() ===
        state.filters.transmission.toLowerCase(),
    );
  }

  if (state.filters.fuelType) {
    result = result.filter(
      (car) => car.fuel.toLowerCase() === state.filters.fuelType.toLowerCase(),
    );
  }

  if (state.filters.bodyType) {
    result = result.filter(
      (car) =>
        car.Body_Type.toLowerCase() === state.filters.bodyType.toLowerCase(),
    );
  }

  if (state.filters.seats > 0) {
    result = result.filter((car) => car.seatCount === state.filters.seats);
  }

  if (state.filters.location) {
    result = result.filter((car) =>
      car.location.toLowerCase().includes(state.filters.location.toLowerCase()),
    );
  }

  switch (state.sortBy) {
    case "newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "oldest":
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      break;
    case "price_asc":
      result.sort((a, b) => a.carprice - b.carprice);
      break;
    case "price_desc":
      result.sort((a, b) => b.carprice - a.carprice);
      break;
    case "popular":
      break;
  }

  return result;
}

export function paginate(
  cars: RawCar[],
  page: number,
  limit: number,
): RawCar[] {
  const start = (page - 1) * limit;
  return cars.slice(start, start + limit);
}
