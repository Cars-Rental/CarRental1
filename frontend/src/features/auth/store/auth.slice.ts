import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  loginSuccess,
  logout,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;