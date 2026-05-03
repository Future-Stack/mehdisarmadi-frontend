// ─── Common API response shapes ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = "admin" | "user" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionPayload {
  userId: string;
  role: UserRole;
  expiresAt: Date;
}

// ─── UI / Misc ────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark" | "system";

export type ToastType = "success" | "error" | "warning" | "info";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
