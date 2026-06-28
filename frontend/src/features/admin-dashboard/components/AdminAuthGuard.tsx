"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { ROLES } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "@/features/auth/store";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const t = useTranslations("AdminDashboard");
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || user?.role !== ROLES.ADMIN) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading || !isAuthenticated || user?.role !== ROLES.ADMIN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t("auth.checking")}</span>
        </div>
      </div>
    );
  }

  return children;
}
