"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/schemas/profile.schema";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Input, Button } from "@/components/ui";
import { useEffect } from "react";

export function ProfileForm() {
  const { profile, updateProfile, isUpdating } = useProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
      avatar: profile?.avatar || "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        email: profile.email,
        bio: profile.bio || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Email Address"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
          disabled // Usually email is not changeable without verification
        />
      </div>
      
      <Input
        label="Avatar URL"
        placeholder="https://example.com/avatar.jpg"
        error={errors.avatar?.message}
        {...register("avatar")}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          rows={4}
          placeholder="Tell us about yourself..."
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {errors.bio.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={isUpdating} className="w-full sm:w-auto">
        Save Changes
      </Button>
    </form>
  );
}
