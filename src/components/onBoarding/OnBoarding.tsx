"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { ROUTES } from "@/constants";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleSkip = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleRegister = () => {
    router.push(ROUTES.REGISTER);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {step === 1 && (
        <Step1 
          onNext={() => setStep(2)} 
          onSkip={handleSkip} 
        />
      )}
      {step === 2 && (
        <Step2
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          onSkip={handleSkip}
        />
      )}
      {step === 3 && (
        <Step3 
          onBack={() => setStep(2)} 
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}