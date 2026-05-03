import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Sign In" };

const LoginForm = dynamic(() => import("@/features/auth/components/LoginForm"), {
  loading: () => <CardSkeleton />,
});

export default function LoginPage() {
  return <LoginForm />;
}
