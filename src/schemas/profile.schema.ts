import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.email({ message: "Enter a valid email address" }),
  bio: z.string().max(160).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your new password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
