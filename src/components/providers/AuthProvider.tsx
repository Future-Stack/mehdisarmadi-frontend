"use client";

import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, setAuthLoading } from "@/store/slices/authSlice";
import { getAccessTokenFromCookie } from "@/lib/axios";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // ── Compute hasToken ONCE on mount (stable state) ─────────────────────────
  // Reading document.cookie inline during render caused infinite loops:
  //   Redux update → re-render → re-read cookie → shouldFetchUser flips →
  //   RTK Query re-fires → dispatch(setCredentials) → Redux update → repeat.
  // By using useState, hasToken is computed only once and never changes.
  const [hasToken] = useState<boolean>(
    () => typeof window !== "undefined" ? !!getAccessTokenFromCookie() : false
  );

  // Only fetch /auth/me when we have a cookie token but aren't yet authenticated in Redux
  const shouldFetchUser = hasToken && !isAuthenticated;

  const { data, isError } = useGetMeQuery(undefined, {
    skip: !shouldFetchUser,
  });

  useEffect(() => {
    if (!hasToken) {
      dispatch(setAuthLoading(false));
      return;
    }

    if (data?.data) {
      dispatch(
        setCredentials({
          user: data.data,
          accessToken: getAccessTokenFromCookie() || "",
          refreshToken: "",
        })
      );
    } else if (isError) {
      dispatch(setAuthLoading(false));
    }
  }, [data, isError, hasToken, dispatch]);

  return <>{children}</>;
}
