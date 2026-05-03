import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Create Account" };

const RegisterForm = dynamic(
  () => import("@/features/auth/components/RegisterForm"),
  { loading: () => <CardSkeleton /> }
);

export default function RegisterPage() {
  return <RegisterForm />;
}
