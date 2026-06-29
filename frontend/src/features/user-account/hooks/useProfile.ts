import { useQuery } from "@tanstack/react-query";
import { getProfileApi, getProfileDocumentApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useProfile() {
  return useQuery({
    queryKey: USER_ACCOUNT_QUERY_KEYS.profile,
    queryFn: getProfileApi,
  });
}

export function useProfileDocument() {
  return useQuery({
    queryKey: [...USER_ACCOUNT_QUERY_KEYS.profile, "document"] as const,
    queryFn: getProfileDocumentApi,
  });
}
