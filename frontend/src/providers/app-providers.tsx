"use client";

import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store/store";
import { ReactQueryProvider } from "./react-query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        {children}
        <Toaster richColors position="top-center" />
      </ReactQueryProvider>
    </Provider>
  );
}