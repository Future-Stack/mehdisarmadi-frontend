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

// ─── Request interceptor: attach token ────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // On the client, read the token from a cookie or memory store.
    // The actual token is managed by the auth slice / cookies.
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

// ─── Response interceptor: handle errors globally ─────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? "An error occurred";

    if (error.response?.status === 401) {
      // Token expired — let the auth flow handle redirect
      if (typeof window !== "undefined") {
        window.location.href = "/login?reason=session_expired";
      }
    } else if (error.response?.status === 403) {
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

function getAccessTokenFromCookie(): string | null {
  const match = document.cookie.match(
    new RegExp(`(^| )${COOKIE_NAMES.ACCESS_TOKEN}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export default apiClient;
