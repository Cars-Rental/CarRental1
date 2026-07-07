import Cookies from "js-cookie";
import { COOKIES } from "@/constants";

export const tokenStorage = {
  getAccessToken() {
    return Cookies.get(COOKIES.ACCESS_TOKEN);
  },

  getRefreshToken() {
    return Cookies.get(COOKIES.REFRESH_TOKEN);
  },

  setTokens(accessToken: string, refreshToken: string) {
    Cookies.set(COOKIES.ACCESS_TOKEN, accessToken, {
      expires: 1,
      sameSite: "lax",
    });

    Cookies.set(COOKIES.REFRESH_TOKEN, refreshToken, {
      expires: 7,
      sameSite: "lax",
    });
  },

  clearTokens() {
    Cookies.remove(COOKIES.ACCESS_TOKEN);
    Cookies.remove(COOKIES.REFRESH_TOKEN);
  },
};