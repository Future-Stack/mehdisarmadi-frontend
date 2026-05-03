"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants";

export default function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => login(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your credentials to continue
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        id="login-email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        required
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        id="login-password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        required
        {...register("password")}
      />

      <div className="flex items-center justify-end">
        <Link
          href="#"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        id="login-submit"
        isLoading={isPending}
        loadingText="Signing in…"
        className="w-full"
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
