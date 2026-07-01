"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { resetPasswordSchema, type ResetPasswordValues } from "@/schemas/auth.schema";
import { usePasswordResetVerifyCodeMutation, usePasswordResetConfirmMutation } from "@/store/api/authApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Logo from "@/components/Reuseable/Logo";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/constants";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  
  const [showPass, setShowPass] = useState(false);
  const [passwordResetVerifyCode] = usePasswordResetVerifyCodeMutation();
  const [passwordResetConfirm] = usePasswordResetConfirmMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: emailParam },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      // 1. Verify code and get token
      const verifyRes = await passwordResetVerifyCode({
        email: data.email,
        code: data.otp,
      }).unwrap();

      const token = (verifyRes as any)?.data?.resetToken || verifyRes?.data?.token || (verifyRes as any)?.token || (verifyRes as any)?.resetToken;
      
      if (!token) {
        throw new Error("No reset token received from server");
      }

      // 2. Confirm reset
      const confirmRes = await passwordResetConfirm({
        token,
        newPassword: data.newPass,
      }).unwrap();

      toast.success(confirmRes.message || "Password reset successfully");
      router.push(ROUTES.LOGIN);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to reset password.");
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
            Reset Password
          </h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Enter the OTP sent to your email and your new password.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          id="reset-password-email"
          placeholder="your@email.com"
          autoComplete="email"
          error={errors.email?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("email")}
        />

        <Input
          label="OTP Code"
          type="text"
          id="reset-password-otp"
          placeholder="Enter 6-digit OTP"
          error={errors.otp?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("otp")}
        />

        <div className="relative">
          <Input
            label="New Password"
            type={showPass ? "text" : "password"}
            id="reset-password-new"
            placeholder="••••••••"
            error={errors.newPass?.message}
            required
            className="h-12 rounded-xl border-gray-200"
            {...register("newPass")}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-10 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <Input
          label="Confirm New Password"
          type={showPass ? "text" : "password"}
          id="reset-password-confirm"
          placeholder="••••••••"
          error={errors.confirmPass?.message}
          required
          className="h-12 rounded-xl border-gray-200"
          {...register("confirmPass")}
        />
      </div>

      <Button
        type="submit"
        id="reset-password-submit"
        isLoading={isSubmitting}
        loadingText="Resetting..."
        className="w-full h-12 rounded-xl font-bold text-base"
      >
        Reset Password
      </Button>
    </form>
  );
}
