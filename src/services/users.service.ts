import apiClient from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, User } from "@/types";
import type { CreateUserFormValues } from "@/schemas/user.schema";
import { buildQueryString } from "@/lib/utils";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_USERS: User[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `user-${i + 1}`,
  name: i === 0 ? "Akash Abrrar" : `Mock User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: "active",
  role: i % 3 === 0 ? "admin" : i % 2 === 0 ? "manager" : "user",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const usersService = {
  getUsers: async (params: GetUsersParams = {}): Promise<PaginatedResponse<User>> => {
    console.log("[Mock GetUsers]", params);
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: "Users fetched (MOCK)",
      data: MOCK_USERS,
      meta: {
        total: MOCK_USERS.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 1,
      },
    };
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = MOCK_USERS.find((u) => u.id === id) || MOCK_USERS[0];
    return { success: true, message: "User fetched (MOCK)", data: user };
  },

  createUser: async (payload: CreateUserFormValues): Promise<ApiResponse<User>> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { 
      success: true, 
      message: "User created (MOCK)", 
      data: { ...MOCK_USERS[0], ...payload, id: Math.random().toString() } 
    };
  },

  updateUser: async (id: string, payload: Partial<CreateUserFormValues>): Promise<ApiResponse<User>> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { 
      success: true, 
      message: "User updated (MOCK)", 
      data: { ...MOCK_USERS[0], ...payload, id } 
    };
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: "User deleted (MOCK)", data: undefined };
  },
};
