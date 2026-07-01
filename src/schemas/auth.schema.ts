import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { error: "Full name must be at least 2 characters" })
      .trim(),
    email: z.email({ error: "Enter a valid email address" }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .regex(/[a-zA-Z]/, { error: "Must contain at least one letter" })
      .regex(/[0-9]/, { error: "Must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim(),
  code: z
    .string()
    .min(6, { error: "Verification code must be 6 digits" })
    .max(6, { error: "Verification code must be 6 digits" })
    .regex(/^\d+$/, { error: "Verification code must contain only numbers" }),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }).trim(),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email address" }).trim(),
    otp: z.string().min(6, { message: "OTP must be at least 6 characters" }),
    newPass: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPass: z.string(),
  })
  .refine((data) => data.newPass === data.confirmPass, {
    message: "Passwords do not match",
    path: ["confirmPass"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
