
import Onboarding from "@/components/onBoarding/OnBoarding";

// Root `/` redirects to dashboard — middleware will handle auth check
export default function RootPage() {
  return (
    <div>
      <Onboarding/>;
    </div>
  )
}
