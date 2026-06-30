"use client";

import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ROLES } from "@/constants";
import { ROUTES } from "@/config/routes";
import { useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/store/hooks";
import { getMeApi } from "../api";
import { loginSuccess, logout } from "../store";
import { tokenStorage } from "../utils";

function getSearchParam(searchParams: URLSearchParams, keys: string[]) {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }

  return null;
}

function getRedirectRoute(role: string) {
  if (role === ROLES.TRADER) return ROUTES.DASHBOARD.ROOT;
  if (role === ROLES.ADMIN) return ROUTES.ADMIN.ROOT;

  return ROUTES.HOME;
}

export function GoogleCallbackPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth.googleCallback");

  useEffect(() => {
    async function completeGoogleLogin() {
      const params = new URLSearchParams(searchParams.toString());
      const error = getSearchParam(params, ["error", "message"]);

      if (error) {
        toast.error(error);
        router.replace(ROUTES.AUTH.LOGIN);
        return;
      }

      const accessToken = getSearchParam(params, ["accessToken", "access_token", "token"]);
      const refreshToken = getSearchParam(params, [
        "refreshToken",
        "refresh_token",
      ]);

      if (accessToken && refreshToken) {
        tokenStorage.setTokens(accessToken, refreshToken);
      }

      try {
        const user = await getMeApi();
        dispatch(loginSuccess(user));
        toast.success(t("success"));
        router.replace(getRedirectRoute(user.role));
      } catch {
        tokenStorage.clearTokens();
        dispatch(logout());
        toast.error(t("failed"));
        router.replace(ROUTES.AUTH.LOGIN);
      }
    }

    completeGoogleLogin();
  }, [dispatch, router, searchParams, t]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 text-center">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <div>
          <h1 className="text-xl font-semibold text-foreground dark:text-slate-100">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground dark:text-slate-400">
            {t("description")}
          </p>
        </div>
      </div>
    </div>
  );
}
