/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation, useDeleteAccountMutation } from "@/store/api/profileApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export function useProfile() {
  const dispatch = useAppDispatch();

  const profileQuery = useGetProfileQuery();

  const [updateProfileApi, updateProfileState] = useUpdateProfileMutation();
  const [updatePasswordApi, updatePasswordState] = useUpdatePasswordMutation();
  const [deleteAccountApi, deleteAccountState] = useDeleteAccountMutation();

  const updateProfile = async (payload: any) => {
    try {
      const response = await updateProfileApi(payload).unwrap();
      dispatch(setUser(response.data));
      toast.success("Profile updated successfully");
      return response;
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
      throw error;
    }
  };

  const updatePassword = async (payload: any) => {
    try {
      const response = await updatePasswordApi(payload).unwrap();
      toast.success("Password updated successfully");
      return response;
    } catch (error: any) {
      toast.error(error?.message || "Failed to update password");
      throw error;
    }
  };

  return {
    profile: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
    updateProfile,
    isUpdating: updateProfileState.isLoading,
    updatePassword,
    isUpdatingPassword: updatePasswordState.isLoading,
    deleteAccount: deleteAccountApi,
    isDeletingAccount: deleteAccountState.isLoading,
  };
}
