import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { COOKIES } from "@/constants";
import { ROUTES } from "@/config/routes";

const intlMiddleware = createMiddleware(routing);

const AUTH_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.VERIFY_EMAIL,
  ROUTES.AUTH.RESET_PASSWORD,
];

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get(COOKIES.ACCESS_TOKEN)?.value;

  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathnameWithoutLocale === route
  );

  if (accessToken && isAuthRoute) {
    const locale = pathname.split("/")[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${ROUTES.HOME}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};