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
    name: z
      .string()
      .min(2, { error: "Name must be at least 2 characters" })
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
