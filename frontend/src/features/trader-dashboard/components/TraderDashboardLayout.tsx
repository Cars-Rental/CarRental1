"use client";

import { useState } from "react";
import { TraderSidebar } from "./TraderSidebar";
import { TraderTopbar } from "./TraderTopbar";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib";

interface TraderDashboardLayoutProps {
  children: React.ReactNode;
}

export function TraderDashboardLayout({
  children,
}: TraderDashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isRTL } = useDirection();

  return (
    <div className="fixed inset-0 flex h-dvh w-full overflow-hidden bg-background text-foreground">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 inset-s-0 z-50 md:static md:z-auto md:block md:h-dvh md:translate-x-0",
          "transition-transform duration-300 ease-in-out",
          isMobileMenuOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full  "
              : "-translate-x-full ",
        )}
      >
        <TraderSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TraderTopbar
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onSidebarCollapseClick={() =>
            setIsSidebarCollapsed((current) => !current)
          }
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
