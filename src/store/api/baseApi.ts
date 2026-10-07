import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import {
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/axios";
import { clearCredentials, setTokens } from "@/store/slices/authSlice";
import type { ApiResponse, AuthTokens } from "@/types";

// Mutex to synchronize token refresh across concurrent RTK Query calls
class Mutex {
  private _locking: Promise<void> | null = null;
  private _locked = false;

  isLocked(): boolean {
    return this._locked;
  }

  async acquire(): Promise<() => void> {
    while (this._locking) {
      await this._locking;
    }
    let release!: () => void;
    this._locking = new Promise<void>((resolve) => {
      release = () => {
        this._locked = false;
        this._locking = null;
        resolve();
      };
    });
    this._locked = true;
    return release;
  }

  async waitForUnlock(): Promise<void> {
    while (this._locking) {
      await this._locking;
    }
  }
}

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://mehdisarmadi.duckdns.org/api/v1/",
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Skip Authorization header for refresh and public auth endpoints
    if (
      endpoint === "refreshToken" ||
      endpoint === "login" ||
      endpoint === "adminLogin" ||
      headers.has("skip-auth")
    ) {
      headers.delete("skip-auth");
      return headers;
    }

    let token = (getState() as RootState).auth.accessToken;
    if (!token && typeof window !== "undefined") {
      token = getAccessTokenFromCookie();
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

function handleAuthFailure(api: { dispatch: (action: unknown) => void }) {
  api.dispatch(clearCredentials());
  clearAuthCookies();
  if (typeof window !== "undefined") {
    if (
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/register") &&
      !window.location.pathname.startsWith("/verify-email")
    ) {
      window.location.href = "/api/auth/signout?reason=session_expired";
    }
  }
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  // Wait until any active refresh is done before firing the request
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    const requestUrl = typeof args === "string" ? args : args.url;
    const isAuthEndpoint =
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/admin/login");

    if (isAuthEndpoint) {
      return result;
    }

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken || getRefreshTokenFromCookie();

        if (!refreshToken) {
          handleAuthFailure(api);
          return result;
        }

        // Call the refresh token endpoint
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
            headers: { "skip-auth": "true" },
          },
          api,
          extraOptions
        );

        const refreshResponse = refreshResult.data as ApiResponse<AuthTokens> | undefined;

        if (
          refreshResult.data &&
          refreshResponse?.success !== false &&
          refreshResponse?.data?.accessToken
        ) {
          const newAccessToken = refreshResponse.data.accessToken;
          const newRefreshToken = refreshResponse.data.refreshToken || refreshToken;

          // Update Redux state with new tokens
          api.dispatch(
            setTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );

          // Update cookies
          setAuthCookies(newAccessToken, newRefreshToken);

          // Retry the original query
          result = await rawBaseQuery(args, api, extraOptions);
          if (result.error && result.error.status === 401) {
            handleAuthFailure(api);
          }
        } else {
          handleAuthFailure(api);
        }
      } catch {
        handleAuthFailure(api);
      } finally {
        release();
      }
    } else {
      // Another call was already refreshing, wait for it to finish
      await mutex.waitForUnlock();
      // Retry the initial query
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Users", "QuoteTemplate", "Project", "Profile", "SystemSettings", "CompanyProfile", "GlobalSettings", "Projects", "Division", "Auth", "Notification", "Notifications", "Settings", "SourceTracking", "AILogs"],
  endpoints: () => ({}),
});
