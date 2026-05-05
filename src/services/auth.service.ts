import apiClient from "@/lib/axios";
import type { ApiResponse, User, AuthTokens } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Mock User for static development ────────────────────────────────────────
const MOCK_USER: User = {
  id: "user-123",
  name: "Akash Abrrar",
  email: "akash@example.com",
  role: "admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akash",
  bio: "Senior Frontend Architect building scalable web applications.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const authService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    console.log("[Mock Login]", payload);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: "Logged in successfully (MOCK)",
      data: {
        user: {
          ...MOCK_USER,
          id: payload.email === "user@renofield.com" ? "user-456" : MOCK_USER.id,
          name: payload.email === "user@renofield.com" ? "Sub User" : MOCK_USER.name,
          email: payload.email,
          role: payload.email === "user@renofield.com" ? "user" : "admin",
        },
        tokens: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
        },
      },
    };
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    console.log("[Mock Register]", payload);
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "Account created (MOCK)",
      data: {
        user: { ...MOCK_USER, name: payload.name, email: payload.email },
        tokens: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
        },
      },
    };
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return { success: true, message: "Logged out", data: undefined };
  },

  refreshToken: (refreshToken: string) =>
    apiClient
      .post<ApiResponse<AuthTokens>>("/auth/refresh", { refreshToken })
      .then((r) => r.data),

  getMe: async (): Promise<ApiResponse<User>> => {
    return { success: true, message: "User fetched (MOCK)", data: MOCK_USER };
  },
};
