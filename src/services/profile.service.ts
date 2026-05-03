import apiClient from "@/lib/axios";
import type { ApiResponse, User } from "@/types";
import type { ProfileFormValues, PasswordChangeFormValues } from "@/schemas/profile.schema";

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

export const profileService = {
  getProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: "Profile fetched (MOCK)", data: MOCK_USER };
  },

  updateProfile: async (payload: ProfileFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { 
      success: true, 
      message: "Profile updated (MOCK)", 
      data: { ...MOCK_USER, ...payload } 
    };
  },

  updatePassword: async (payload: Omit<PasswordChangeFormValues, "confirmPassword">) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "Password updated (MOCK)", data: undefined };
  },
};
