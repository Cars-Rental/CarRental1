"use client";

import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store/store";
import { ReactQueryProvider } from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";
import "@/services";
import { AuthInitializer } from "@/features/auth/components";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <ThemeProvider>
          <AuthInitializer />
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </ReactQueryProvider>
    </Provider>
  );
}
