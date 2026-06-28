"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib";
import { AdminAuthGuard } from "./AdminAuthGuard";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isRTL } = useDirection();

  return (
    <AdminAuthGuard>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div
          className={cn(
            "fixed inset-y-0 inset-s-0 z-50 transition-transform duration-300 ease-in-out md:static md:z-auto md:block md:translate-x-0",
            isMobileMenuOpen
              ? "translate-x-0"
              : isRTL
                ? "translate-x-full"
                : "-translate-x-full"
          )}
        >
          <AdminSidebar isCollapsed={isSidebarCollapsed} />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar
            isSidebarCollapsed={isSidebarCollapsed}
            onMenuClick={() => setIsMobileMenuOpen((current) => !current)}
            onSidebarCollapseClick={() =>
              setIsSidebarCollapsed((current) => !current)
            }
          />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
