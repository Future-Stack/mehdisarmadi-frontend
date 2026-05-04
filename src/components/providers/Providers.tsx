"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";
import { store } from "@/store";

import ThemeProvider from "./ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
  // Create a stable QueryClient per session (not per render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 min
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            onError: () => {
              // Handled globally in the Axios interceptor / mutation callbacks
            },
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
