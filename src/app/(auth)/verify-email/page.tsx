import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Verify Email" };

const VerifyEmailForm = dynamic(
  () => import("@/features/auth/components/VerifyEmailForm"),
  { loading: () => <CardSkeleton /> }
);

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
