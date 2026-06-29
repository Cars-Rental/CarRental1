import axios from "axios";
import { env } from "@/config/env";

const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }
  return config;
});

export default axiosInstance;