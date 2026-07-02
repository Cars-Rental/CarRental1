import { API_ENDPOINTS } from "@/constants";
import { env } from "@/config/env";

export function getGoogleAuthUrl() {
  return new URL(API_ENDPOINTS.AUTH.GOOGLE, env.apiBaseUrl).toString();
}
