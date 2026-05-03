import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

// Root `/` redirects to dashboard — middleware will handle auth check
export default function RootPage() {
  redirect(ROUTES.DASHBOARD);
}
