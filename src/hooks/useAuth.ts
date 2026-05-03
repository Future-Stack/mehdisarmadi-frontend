"use client";

import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";

/** Typed selector for the auth slice */
export function useAuth() {
  return useAppSelector((s: RootState) => s.auth);
}

/** Returns true only when auth is confirmed and a user is present */
export function useIsAuthenticated(): boolean {
  return useAppSelector((s: RootState) => s.auth.isAuthenticated);
}

/** Returns the current user or null */
export function useCurrentUser() {
  return useAppSelector((s: RootState) => s.auth.user);
}
