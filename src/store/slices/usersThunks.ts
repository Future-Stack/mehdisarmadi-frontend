import { createAsyncThunk } from "@reduxjs/toolkit";
import { usersService } from "@/services/users.service";
import type { User } from "@/types";

export const fetchUsersThunk = createAsyncThunk<
  User[],
  { page?: number; limit?: number },
  {
    rejectValue: string;
  }
>("users/fetchUsers", async (params, { rejectWithValue }) => {
  try {
    const response = await usersService.getUsers(params.page, params.limit);
    if (!response.success) {
      return rejectWithValue(response.message || "Failed to fetch users");
    }
    return response.data || [];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch users"
    );
  }
});

export const fetchUserByIdThunk = createAsyncThunk<
  User,
  string,
  {
    rejectValue: string;
  }
>("users/fetchUserById", async (userId, { rejectWithValue }) => {
  try {
    const response = await usersService.getUserById(userId);
    if (!response.success) {
      return rejectWithValue(response.message || "Failed to fetch user");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch user"
    );
  }
});

export const deleteUserThunk = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>("users/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    const response = await usersService.deleteUser(userId);
    if (!response.success) {
      return rejectWithValue(response.message || "Failed to delete user");
    }
    return userId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete user"
    );
  }
});
