import apiClient from "@/lib/axios";
import type { ApiResponse, User, AuthTokens } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    status: string;
    createdAt: string;
  };
}

export interface VerifyEmailResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  isFirstTimer: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  isFirstTimer?: boolean;
}

export const authService = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<RegisterResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        "/auth/register",
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (
    payload: VerifyEmailPayload
  ): Promise<ApiResponse<VerifyEmailResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
        "/auth/verify-email",
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>("/auth/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthTokens>>(
        "/auth/refresh-token",
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  adminLogin: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/admin/login",
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

