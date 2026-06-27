"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVerifyEmail } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import Logo from "@/components/Reuseable/Logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

// ─── Validation Schema ────────────────────────────────────────────────────

const verifyEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

// ─── Component ────────────────────────────────────────────────────────────

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email");
  const { verifyEmail, isLoading } = useVerifyEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: emailParam || "",
      code: "",
    },
  });

  // Auto-focus code input
  useEffect(() => {
    if (emailParam) {
      const codeInput = document.getElementById("verify-code") as HTMLInputElement;
      codeInput?.focus();
    }
  }, [emailParam]);

  const onSubmit = async (data: VerifyEmailFormValues) => {
    try {
      await verifyEmail(data.email, data.code);
    } catch (err) {
      // Error is already handled by useVerifyEmail hook
    }
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    setValue("code", value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
      noValidate
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#059669]">Verify Email</h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Enter the 6-digit code sent to your email
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          id="verify-email"
          placeholder="your@email.com"
          autoComplete="email"
          error={errors.email?.message}
          required
          disabled
          className="h-12 rounded-xl border-gray-200 bg-gray-50 cursor-not-allowed"
          {...register("email")}
        />

        <div>
          <label
            htmlFor="verify-code"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Verification Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="verify-code"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            autoComplete="off"
            className={`w-full px-4 py-3 text-center text-3xl tracking-widest font-bold rounded-xl border-2 transition ${
              errors.code?.message
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-[#059669]"
            } focus:outline-none focus:ring-2`}
            {...register("code", {
              onChange: handleCodeInput,
            })}
          />
          {errors.code?.message && (
            <p className="mt-2 text-sm text-red-500 font-medium">
              {errors.code.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-4">
        <Button
          type="submit"
          id="verify-submit"
          isLoading={isLoading}
          loadingText="Verifying…"
          className="w-full h-12 rounded-xl font-bold text-base"
        >
          Verify Email
        </Button>

        {/* Back Link */}
        <div className="flex items-center justify-center">
          <Link
            href={ROUTES.REGISTER}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
          >
            <ArrowLeft size={16} />
            Back to Register
          </Link>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-900 font-medium">
          📧 Didn't receive the code? Check your spam folder or{" "}
          <Link href={ROUTES.REGISTER} className="underline font-bold hover:text-blue-700">
            try registering again
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
