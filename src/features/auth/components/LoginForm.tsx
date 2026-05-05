"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import Logo from "@/components/Reuseable/Logo";
import { ArrowLeft } from "lucide-react";

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
      className="flex flex-col gap-8"
      noValidate
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#059669]">
            Welcome Back
          </h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Login to manage your tender projects
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          id="login-email"
          placeholder="Enter your email address"
          autoComplete="email"
          error={errors.email?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          id="login-password"
          placeholder="Enter your Password"
          autoComplete="current-password"
          error={errors.password?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("password")}
        />
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          id="login-submit"
          isLoading={isPending}
          loadingText="Signing in…"
          className="w-full h-12 rounded-xl font-bold text-base"
        >
          Login
        </Button>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="#"
            className="text-sm text-[#059669] font-semibold hover:underline"
          >
            Forgot Password?
          </Link>

          <p className="text-sm text-gray-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-bold text-[#059669] hover:underline ml-1"
            >
              Sign Up
            </Link>
          </p>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#059669] font-medium transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 w-full">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 text-center">Default Credentials</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) {
                    const email = document.getElementById('login-email') as HTMLInputElement;
                    const pass = document.getElementById('login-password') as HTMLInputElement;
                    if (email && pass) {
                      email.value = "user@renofield.com";
                      pass.value = "password123";
                      // Trigger react-hook-form change
                      email.dispatchEvent(new Event('input', { bubbles: true }));
                      pass.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }
                }}
                className="px-3 py-2 bg-white rounded-xl border border-emerald-100 text-[11px] font-bold text-gray-600 hover:bg-emerald-100 transition-all"
              >
                Login as User
              </button>
              <button 
                type="button"
                onClick={() => {
                  const email = document.getElementById('login-email') as HTMLInputElement;
                  const pass = document.getElementById('login-password') as HTMLInputElement;
                  if (email && pass) {
                    email.value = "admin@renofield.com";
                    pass.value = "password123";
                    email.dispatchEvent(new Event('input', { bubbles: true }));
                    pass.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
                className="px-3 py-2 bg-white rounded-xl border border-emerald-100 text-[11px] font-bold text-gray-600 hover:bg-emerald-100 transition-all"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
