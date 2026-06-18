"use client";

import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store/store";
import { ReactQueryProvider } from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";
import "@/services";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </ReactQueryProvider>
    </Provider>
  );
}