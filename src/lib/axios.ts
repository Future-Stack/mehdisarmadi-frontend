import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_URL, COOKIE_NAMES } from "@/constants";
import { toast } from "sonner";

// ─── Axios instance ────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Token Refresh State ───────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function handleSignout() {
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

// ─── Request interceptor: attach token ────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip Authorization header for refresh and auth endpoints
    if (
      config.url?.includes("/auth/refresh") ||
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/admin/login")
    ) {
      return config;
    }

    if (typeof window !== "undefined") {
      const token = getAccessTokenFromCookie();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle errors globally & refresh token ─────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || "";
      const isAuthEndpoint =
        url.includes("/auth/refresh") ||
        url.includes("/auth/login") ||
        url.includes("/auth/admin/login") ||
        url.includes("/auth/register");

      if (isAuthEndpoint) {
        handleSignout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshTokenFromCookie();
      if (!refreshToken) {
        isRefreshing = false;
        handleSignout();
        return Promise.reject(error);
      }

      try {
        const refreshBaseUrl = API_URL.replace(/\/+$/, "");
        const response = await axios.post(
          `${refreshBaseUrl}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const resData = response.data?.data;
        const newAccessToken = resData?.accessToken;
        const newRefreshToken = resData?.refreshToken || refreshToken;

        if (response.data?.success !== false && newAccessToken) {
          setAuthCookies(newAccessToken, newRefreshToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          processQueue(new Error("Token refresh failed"), null);
          handleSignout();
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        handleSignout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? "An error occurred";

    if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (error.response && error.response.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (!error.response) {
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject({
      message,
      statusCode: error.response?.status ?? 0,
      errors: (error.response?.data as Record<string, unknown>)?.errors,
    });
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────

export function getAccessTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAMES.ACCESS_TOKEN}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function getRefreshTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAMES.REFRESH_TOKEN}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAuthCookies(accessToken: string, refreshToken?: string | null) {
  if (typeof window === "undefined") return;
  document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=${encodeURIComponent(accessToken)}; path=/; max-age=604800; samesite=lax`;
  if (refreshToken) {
    document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=${encodeURIComponent(refreshToken)}; path=/; max-age=2592000; samesite=lax`;
  }
}

export function clearAuthCookies() {
  if (typeof window === "undefined") return;
  document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default apiClient;
