"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import Logo from "@/components/Reuseable/Logo";
import { ArrowLeft } from "lucide-react";

export default function RegisterForm() {
  const { register: registerUser, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await registerUser(data.fullName, data.email, data.password);
  };

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
            Create Account
          </h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Join TenderPro AI to streamline your workflow
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          id="register-name"
          placeholder="Enter your Name"
          error={errors.fullName?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("fullName")}
        />

        <Input
          label="Email Address"
          type="email"
          id="register-email"
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
          id="register-password"
          placeholder="Enter your Password"
          autoComplete="new-password"
          error={errors.password?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("password")}
        />
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          id="register-submit"
          isLoading={isLoading}
          loadingText="Creating account…"
          className="w-full h-12 rounded-xl font-bold text-base"
        >
          Sign Up
        </Button>

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-bold text-[#059669] hover:underline ml-1"
            >
              Login
            </Link>
          </p>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#059669] font-medium transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </form>
  );
}
