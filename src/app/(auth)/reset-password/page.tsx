import { Suspense } from "react";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | TenderPro AI",
  description: "Create a new password for TenderPro AI",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
