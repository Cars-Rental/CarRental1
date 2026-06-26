"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useDirection } from "@/lib";
import { Logo } from "@/components/shared";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { NavbarActions } from "./NavbarActions";


export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isRTL } = useDirection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md border-b border-slate-200/50 dark:border-slate-800/50 py-3"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-900/60 py-4"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <Logo />

        <DesktopNav />

        <div className="flex items-center gap-2.5">
          <NavbarActions />

          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}