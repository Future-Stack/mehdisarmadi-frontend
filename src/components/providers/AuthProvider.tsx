"use client";

import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, setAuthLoading } from "@/store/slices/authSlice";
import { getAccessTokenFromCookie } from "@/lib/axios";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  // Only try to fetch if we have a token in the cookie but we aren't authenticated in Redux yet
  const hasToken = typeof window !== "undefined" ? !!getAccessTokenFromCookie() : false;
  const shouldFetchUser = hasToken && !isAuthenticated;

  // useGetMeQuery will skip if shouldFetchUser is false
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !shouldFetchUser,
  });

  useEffect(() => {
    // If there is no token, we can mark loading as false
    if (!hasToken) {
      dispatch(setAuthLoading(false));
      return;
    }

    // If we successfully fetched the user data, store it in Redux
    if (data?.data) {
      dispatch(
        setCredentials({
          user: data.data,
          accessToken: getAccessTokenFromCookie() || "",
          refreshToken: "", // Refresh token isn't strictly needed here unless the API gives it
        })
      );
    } else if (isError) {
      // If fetching failed (e.g., token expired), auth logic in axios interceptor handles redirect
      dispatch(setAuthLoading(false));
    }
  }, [data, isError, hasToken, dispatch]);

  return <>{children}</>;
}
