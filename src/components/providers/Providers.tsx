"use client";

import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store";
import ThemeProvider from "./ThemeProvider";
import AuthProvider from "./AuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
