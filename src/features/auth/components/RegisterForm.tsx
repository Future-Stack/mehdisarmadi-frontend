"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants";

export default function RegisterForm() {
  const { mutate: register_, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword: _, ...payload } = data;
    register_(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get started for free today
        </p>
      </div>

      <Input
        label="Full Name"
        type="text"
        id="register-name"
        placeholder="Jane Doe"
        autoComplete="name"
        error={errors.name?.message}
        required
        {...register("name")}
      />

      <Input
        label="Email"
        type="email"
        id="register-email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        required
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        id="register-password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Min 8 chars with at least one letter and number"
        error={errors.password?.message}
        required
        {...register("password")}
      />

      <Input
        label="Confirm Password"
        type="password"
        id="register-confirm-password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        required
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        id="register-submit"
        isLoading={isPending}
        loadingText="Creating account…"
        className="w-full"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
