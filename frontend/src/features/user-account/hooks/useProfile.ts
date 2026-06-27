import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useProfile() {
  return useQuery({
    queryKey: USER_ACCOUNT_QUERY_KEYS.profile,
    queryFn: getProfileApi,
  });
}
