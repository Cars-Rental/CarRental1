import type { GetCarsParams, GetCarsResponse } from "../types";
import { MOCK_SALE_CARS, filterAndPaginateCars } from "../utils";

export async function getSaleCarsApi(
  params?: GetCarsParams,
): Promise<GetCarsResponse> {
  return Promise.resolve(filterAndPaginateCars(MOCK_SALE_CARS, params));
}
