import type { MarketplaceCar, GetCarsParams, GetCarsResponse } from "../types";

export function filterAndPaginateCars(
  cars: MarketplaceCar[],
  params?: GetCarsParams
): GetCarsResponse {
  if (!params) {
    return { cars, total: cars.length };
  }

  const {
    search,
    brands,
    priceMin,
    priceMax,
    yearMin,
    yearMax,
    transmission,
    fuelType,
    bodyType,
    seats,
    location,
    sortBy,
    page = 1,
    limit = 9,
  } = params;

  let filteredCars = [...cars];

  // 1. Search Filter (match name, brand, model)
  if (search) {
    const s = search.toLowerCase().trim();
    filteredCars = filteredCars.filter(
      (car) =>
        car.name.toLowerCase().includes(s) ||
        car.brand.toLowerCase().includes(s) ||
        car.model.toLowerCase().includes(s)
    );
  }

  // 2. Brand Filter
  if (brands && brands.length > 0) {
    const lowerBrands = brands.map((b) => b.toLowerCase());
    filteredCars = filteredCars.filter((car) =>
      lowerBrands.includes(car.brand.toLowerCase())
    );
  }

  // 3. Price Filter (check pricePerDay for Rent, priceTotal for Sale)
  if (priceMin !== undefined) {
    filteredCars = filteredCars.filter((car) => {
      const price = car.pricePerDay > 0 ? car.pricePerDay : car.priceTotal;
      return price >= priceMin;
    });
  }
  if (priceMax !== undefined) {
    filteredCars = filteredCars.filter((car) => {
      const price = car.pricePerDay > 0 ? car.pricePerDay : car.priceTotal;
      return price <= priceMax;
    });
  }

  // 4. Year Filter
  if (yearMin !== undefined) {
    filteredCars = filteredCars.filter((car) => car.year >= yearMin);
  }
  if (yearMax !== undefined) {
    filteredCars = filteredCars.filter((car) => car.year <= yearMax);
  }

  // 5. Transmission
  if (transmission) {
    filteredCars = filteredCars.filter(
      (car) => car.transmission === transmission
    );
  }

  // 6. Fuel Type
  if (fuelType) {
    filteredCars = filteredCars.filter((car) => car.fuelType === fuelType);
  }

  // 7. Body Type
  if (bodyType) {
    filteredCars = filteredCars.filter((car) => car.bodyType === bodyType);
  }

  // 8. Seats
  if (seats && seats > 0) {
    filteredCars = filteredCars.filter((car) => car.seats === seats);
  }

  // 9. Location
  if (location) {
    const loc = location.toLowerCase().trim();
    filteredCars = filteredCars.filter((car) =>
      car.location.toLowerCase().includes(loc)
    );
  }

  // 10. Sorting
  if (sortBy) {
    switch (sortBy) {
      case "newest":
        // Sort by year desc (newest model years) or we could sort by ID, let's do year desc
        filteredCars.sort((a, b) => b.year - a.year);
        break;
      case "oldest":
        filteredCars.sort((a, b) => a.year - b.year);
        break;
      case "price_asc":
        filteredCars.sort((a, b) => {
          const priceA = a.pricePerDay > 0 ? a.pricePerDay : a.priceTotal;
          const priceB = b.pricePerDay > 0 ? b.pricePerDay : b.priceTotal;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        filteredCars.sort((a, b) => {
          const priceA = a.pricePerDay > 0 ? a.pricePerDay : a.priceTotal;
          const priceB = b.pricePerDay > 0 ? b.pricePerDay : b.priceTotal;
          return priceB - priceA;
        });
        break;
      case "popular":
        // Sort by rating desc, then review count desc
        filteredCars.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }
  }

  // Calculate total matched count before pagination
  const total = filteredCars.length;

  // 11. Pagination
  const startIndex = (page - 1) * limit;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + limit);

  return {
    cars: paginatedCars,
    total,
  };
}
