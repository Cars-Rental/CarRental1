"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_LINKS } from "@/features/landing/constants/landing.constants";
import { useDirection } from "@/lib";

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isRTL } = useDirection();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLang = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
  };

  // Determine active route
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === `/${locale}`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md border-b border-slate-200/50 dark:border-slate-800/50 py-3"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-900/60 py-4"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <nav className="container-main flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <Image
            src="/assets/images/logos/logo.png"
            alt="DriveEase"
            width={120}
            height={36}
            className="h-8 w-auto object-contain dark:brightness-110"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1.5 font-medium">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={`/${locale}${link.href}`}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "text-[var(--primary)] bg-emerald-50/60 dark:bg-slate-800/60"
                      : "text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {isRTL ? link.labelAr : link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold"
          >
            <Globe size={15} />
            <span>{locale === "ar" ? "English" : "العربية"}</span>
          </button>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5 ms-1">
            <Link
              href={`/${locale}/login`}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors"
            >
              {locale === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="bg-[#005c55] hover:bg-[#004741] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              {locale === "ar" ? "إنشاء حساب" : "Sign Up"}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 px-4 py-6 space-y-3 shadow-inner">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "text-[var(--primary)] bg-emerald-50/50 dark:bg-slate-800/50"
                    : "text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {isRTL ? link.labelAr : link.label}
              </Link>
            );
          })}

          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-900">
            <Link
              href={`/${locale}/login`}
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors"
            >
              {locale === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
            <Link
              href={`/${locale}/register`}
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-[#005c55] hover:bg-[#004741] text-white text-sm font-bold py-3 rounded-xl shadow-md transition-all duration-150"
            >
              {locale === "ar" ? "إنشاء حساب" : "Sign Up"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
