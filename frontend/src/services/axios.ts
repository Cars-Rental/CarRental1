import axios from "axios";
import { env } from "@/config/env";

const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;