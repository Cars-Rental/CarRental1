"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getMeApi } from "../api";
import { loginSuccess, logout, setLoading } from "../store";
import { tokenStorage } from "../utils";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function initAuth() {
      const accessToken = tokenStorage.getAccessToken();

      if (!accessToken) {
        dispatch(logout());
        return;
      }

      try {
        dispatch(setLoading(true));
        const user = await getMeApi();
        dispatch(loginSuccess(user));
      } catch {
        tokenStorage.clearTokens();
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    }

    initAuth();
  }, [dispatch]);

  return null;
}