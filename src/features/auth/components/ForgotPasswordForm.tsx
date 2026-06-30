"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import Logo from "@/components/Reuseable/Logo";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { usePasswordResetSendCodeMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [passwordResetSendCode] = usePasswordResetSendCodeMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await passwordResetSendCode({ email: data.email }).unwrap();
      toast.success("OTP sent to your email.");
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send reset email.");
    }
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
            Forgot Password
          </h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Enter your email to receive a password reset link
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          id="forgot-password-email"
          placeholder="Enter your email address"
          autoComplete="email"
          error={errors.email?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("email")}
        />
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          id="forgot-password-submit"
          isLoading={isSubmitting}
          loadingText="Sending link..."
          className="w-full h-12 rounded-xl font-bold text-base"
        >
          Send Reset Link
        </Button>

        <div className="flex flex-col items-center gap-4">
          <Link
            href={ROUTES.LOGIN}
            className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-[#059669] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </form>
  );
}
