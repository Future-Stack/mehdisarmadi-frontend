import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.email(),
  role: z.enum(["ADMIN", "USER", "MANAGER"]),
  avatar: z.string().url().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters" }),
  email: z.email({ error: "Enter a valid email address" }),
  role: z.enum(["ADMIN", "USER", "MANAGER"]),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
