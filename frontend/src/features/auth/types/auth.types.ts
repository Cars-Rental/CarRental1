import type { UserRole } from "@/constants/roles";

export type Gender = "male" | "female";

export interface AuthUser {
  id: string;
  userName: string;
  email: string;
  phone: string;
  gender: Gender;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  phone: string;
  gender: Gender;
  password: string;
  confirmPassword: string;
  role: Exclude<UserRole, "admin">;
}

export interface AuthData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
}