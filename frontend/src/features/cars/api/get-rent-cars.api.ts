import type { GetCarsParams, GetCarsResponse } from "../types";
import { MOCK_RENT_CARS, filterAndPaginateCars } from "../utils";

export async function getRentCarsApi(params?: GetCarsParams): Promise<GetCarsResponse> {
  return Promise.resolve(filterAndPaginateCars(MOCK_RENT_CARS, params));
}
