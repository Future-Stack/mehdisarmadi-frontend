"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/store/slices/uiSlice";
import type { ThemeMode } from "@/types";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  // Save to localStorage and apply class
  useEffect(() => {
    if (!theme) return;
    
    const root = window.document.documentElement;
    
    // Remove both classes to start fresh
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      localStorage.removeItem("theme"); // Or localStorage.setItem("theme", "system")
    } else {
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Listen for system theme changes if set to system
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return <>{children}</>;
}
