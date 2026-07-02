"use client";

import { getGoogleAuthUrl } from "../api";

export function useGoogleLogin() {
  return () => {
    window.location.assign(getGoogleAuthUrl());
  };
}
