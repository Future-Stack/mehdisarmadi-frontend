// ─── App-wide constants ────────────────────────────────────────────────────

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Dashboard";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  SETTINGS: "/dashboard/settings",
} as const;

export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const QUERY_KEYS = {
  USER: "user",
  USERS: "users",
  DASHBOARD_STATS: "dashboardStats",
  SETTINGS: "settings",
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const;
